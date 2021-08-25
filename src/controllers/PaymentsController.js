const sequelize = require("sequelize");
const op = sequelize.Op;
const moment = require("moment");

const Payment = require("../../models").Payment;
const Customer = require("../../models").Customer;
const Package = require("../../models").Package;
const AgentCredit = require("../../models").AgentCredit;
const MpesaCustomerRegister = require("../../models").MpesaCustomerRegister;
const PaymentStatus = require("../../models").PaymentStatus;
const PaymentType = require("../../models").PaymentType;
const StkStatus = require("../../models").StkStatus;

const {
  createError,
  validatePaymentInput,
  cleanPhone,
  isEmpty,
} = require("../validation");

const MpesaController = require("./MpesaController");

module.exports = {
  initiateStk(customer, result) {
    // validate data
    const {
      errors,
      isValid,
      //check if fiels is empty
    } = validatePaymentInput(customer);
    if (!isValid) {
      const customError = createError(errors);
      result(customError, null);
    } else {
      const mpesa = new MpesaController();
      const url = "https://mymawingu-app-backend.mawingunetworks.com";
      mpesa
        .sktPush(customer.amount, customer.phone, customer.accountno, url)
        .then((resp) => {
          console.log({ resp });
          if (resp.MerchantRequestID) {
            StkStatus.create({
              amount: customer.amount,
              phone: customer.phone,
              account: customer.accountno,
            });
            result(null, {
              message:
                "You will be requested to enter your M-Pesa pin in a few",
            });
          } else {
            result(
              {
                message: "An error occured",
              },
              null
            );
          }
        })
        .catch((err) => {
          result(createError(err), null);
        });
    }
  },
  confirmStk(data, result) {
    let dataPayment = data.Body.stkCallback;
    let phoneNumber = dataPayment.MSISDN;
    let metadata = dataPayment.CallbackMetadata.Item;
    let TransAmount = metadata[0].Value;
    let data_array = [];
    let customer = {};
    let custPackage = {};
    let extraData = 0;
    // save this data to payment table
    // console.log({ dataPayment, TransAmount })
    Payment.findOne({
      where: {
        merchantRequestID: dataPayment.MerchantRequestID,
        checkoutRequestID: dataPayment.CheckoutRequestID,
      },
    })
      .then(async (payment) => {
        if (dataPayment.ResultCode != 0 || payment == null) {
          await Payment.create({
            merchantRequestID: dataPayment.MerchantRequestID,
            checkoutRequestID: dataPayment.CheckoutRequestID,
            resultCode: dataPayment.ResultCode,
            resultDescription: dataPayment.ResultDesc,
            amount: metadata[0].Value,
            mpesaReceiptNumber: metadata[1].Value,
            till_validated_on: metadata[3].Value,
            payment_status_id: 5,
            phone: phoneNumber,
            payment_type_id: 2,
            confirmed_on: new Date(),
          })
            .then((payment) => {
              console.log(payment);
              result(
                {
                  error: {
                    STK: "Result code is not 0. Saved payment as rejected",
                  },
                },
                null
              );
            })
            .catch((err) => {
              console.log(err);
              result(
                {
                  error: {
                    STK: "Result code is not 0. Unable to save payment as rejected",
                  },
                },
                null
              );
            });
        } else {
          data_array["merchantRequestID"] = dataPayment.MerchantRequestID;
          data_array["checkoutRequestID"] = dataPayment.CheckoutRequestID;
          data_array["resultCode"] = dataPayment.ResultCode;
          data_array["resultDesc"] = dataPayment.ResultDesc;
          data_array["amount"] = metadata[0].Value;
          data_array["mpesaReceiptNumber"] = metadata[1].Value;
          data_array["till_validated_on"] = metadata[3].Value;
          data_array["phone"] = phoneNumber;
          data_array["created_at"] = new Date();
          data_array["confirmed_on"] = new Date();
          data_array["updated_at"] = new Date();
          data_array["payment_type_id"] = 2;
          Customer.findOne({
            where: {
              id: payment.customer_id,
            },
          })
            .then((dbCustomer) => {
              console.log(dbCustomer);
              if (dbCustomer == null) {
                data_array["access_code"] = null;
                data_array["lock_id"] = null;
                data_array["lock_agent_id"] = null;
                data_array["customer_id"] = null;
                data_array["agent_id"] = null;
                data_array["lock_status"] = null;
                result(
                  {
                    error: {
                      STK: "An error eccoured",
                    },
                  },
                  null
                );
              } else {
                data_array["access_code"] = dbCustomer.access_code;
                data_array["lock_id"] = dbCustomer.lock_id;
                data_array["lock_status"] = dbCustomer.lock_status;
                data_array["agent_id"] = dbCustomer.lock_agent_id;
                data_array["customer_id"] = dbCustomer.id;
                data_array["phone"] = dbCustomer.phone;
                this.getCustomerBalance(dbCustomer.access_code, (err, cust) => {
                  if (err) {
                    console.log(err);
                  } else {
                    data_array["existing"] = parseInt(cust.total_bought);
                    console.log(parseInt(cust.total_usage));
                    console.log(parseInt(cust.total_bought));
                    overuse =
                      parseInt(cust.total_usage) - parseInt(cust.total_bought);
                    if (overuse > 0) {
                      extraData = overuse;
                      // data_array["data_limit"] = parseInt(dbPackage.data_limit) + parseInt(overuse);
                    } else {
                      extraData = 0;
                    }

                    console.log("overuse is", extraData);
                    Package.findOne({
                      where: {
                        price: parseInt(TransAmount),
                        status: 1,
                        type: 2,
                      },
                    })
                      .then(async (dbPackage) => {
                        if (dbPackage == null) {
                          data_array["package_name"] = null;
                          data_array["package_id"] = null;
                          data_array["expiry_date"] = null;
                          data_array["data_limit"] = null;
                          data_array["payment_status_id"] = 7;
                        } else {
                          data_array["packagedata"] = dbPackage.data_limit;
                          data_array["package_name"] = dbPackage.name;
                          data_array["package_id"] = dbPackage.id;
                          data_array["payment_status_id"] = 6;
                          data_array["expiry_date"] = moment(new Date())
                            .add(dbPackage.valid_days, "days")
                            .format("YYYY-MM-DD HH:mm:ss");
                          data_array["data_limit"] =
                            parseInt(dbPackage.data_limit) +
                            parseInt(extraData);
                        }
                        console.log(data_array["data_limit"]);
                        console.log("overuse  now in db package is", extraData);
                        //bulkcreate and update
                        await Payment.update(data_array, {
                          where: {
                            merchantRequestID: dataPayment.MerchantRequestID,
                            checkoutRequestID: dataPayment.CheckoutRequestID,
                          },
                          // updateOnDuplicate: ["access_code", "customer_id", "payment_status_id", "package_name", "package_id", "data_limit", "confirmed_on", "expiry_date", "lock_id", "agent_id", ],
                        })
                          .then((upPayment) => {
                            console.log("creatd is", upPayment);
                            if (data_array["payment_status_id"] == 6) {
                              console.log(
                                "dbpackage after save",
                                data_array.access_code
                              );
                              RadiusController.deleteRadUserGroup(
                                data_array.access_code,
                                (err, data) => {
                                  if (err) {
                                    result(createError(err), null);
                                  } else {
                                    textmessage(
                                      data_array.phone,
                                      "You have received " +
                                        data_array.package_name +
                                        " bundle. You now have " +
                                        data_array.packagedata +
                                        " MB of data until " +
                                        data_array.expiry_date +
                                        ". Your access code is " +
                                        data_array.access_code +
                                        ". Call 0716100200 for support.",
                                      (err, smsResult) => {
                                        if (err) {
                                          result(null, {
                                            message: "error ocuured",
                                          });
                                        } else {
                                          this.updateCustomerDataBought(
                                            data_array.customer_id,
                                            data_array.data_limit,
                                            data_array.existing,
                                            (err, cust) => {
                                              if (err) {
                                                console.log(err);
                                              } else {
                                                if (
                                                  data_array.lock_status == 1
                                                ) {
                                                  MpesaCustomerRegister.update(
                                                    {
                                                      updated_at: new Date(),
                                                      amount: TransAmount,
                                                    },
                                                    {
                                                      where: {
                                                        id: data_array.lock_id,
                                                      },
                                                    }
                                                  )
                                                    .then({})
                                                    .catch({});
                                                }
                                                result(null, {
                                                  message: "message sent",
                                                });
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            } else {
                              result(null, {
                                message: "Done",
                              });
                            }
                          })
                          .catch((err) => {
                            result(
                              {
                                error: {
                                  STK: "An error eccoured",
                                },
                              },
                              null
                            );
                          });
                      })
                      .catch((err) => {
                        result(
                          {
                            error: {
                              STK: "An error eccoured",
                            },
                          },
                          null
                        );
                      });
                  }
                });
              }
            })
            .catch((err) => {
              console.log(err);
              result(
                {
                  error: {
                    STK: "An error eccoured",
                  },
                },
                null
              );
            });

          //get customer balance
          //calaculate total overuse
          //update details
          //deletefrom raduserdrpup
          //update customer and lock table
          //send sms
        }
      })
      .catch((err) => {
        result(createError(err), null);
      });
  },
};
