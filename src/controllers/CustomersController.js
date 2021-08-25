const sequelize = require("sequelize");
const Customer = require("../../models").Customer;
// const SplynxApi = require("splynx-nodejs-api");
var request = require("request");
const MpesaController = require("./MpesaController");

// //configuration
// var setup = {
//   envs: {
//     test: {
//       API_KEY: "f86566e918169721e19537f2941aba5a",
//       API_SECRET: "1906b7e13ad993b76563b1007d4215fb",
//       SPLYNX_HOST: "https://196.250.208.233",
//       NOTIFY_DATE: 6,
//       REMINDER_DATE: 5,
//       DIS_AMOUNT: 200,
//       DISCONNECT_DATE: 8,
//     },
//     live: {
//       API_KEY: "2e1f479cd6d3cb7694deed187f07279b",
//       API_SECRET: "333cdcaae2fede273cb9b53ee513235f",
//       SPLYNX_HOST: "https://home.mawingunetworks.com",
//       NOTIFY_DATE: 7,
//       REMINDER_DATE: 5,
//       DIS_AMOUNT: 200,
//       DISCONNECT_DATE: 6,
//     },
//   },
// };

// var env = "live"; //test for test and live for live
// var loadedConfig = setup.envs[env]; //declared variables in live and test

// //initialization
// const api = new SplynxApi(loadedConfig.SPLYNX_HOST);
// api.version = SplynxApi.API_VERSION_2_0;

module.exports = {
  //   //getcustomers
  //   getCustomers(result) {
  //     Customer.findAll()
  //       .then((customers) => {
  //         result(null, customers);
  //       })
  //       .catch((err) => {
  //         result(err, null);
  //       });
  //   },
  //   //   login a customer
  loginCustomer(customer, result) {
    console.log(customer);
    Customer.findOne({
      where: { id: customer },
    })
      .then((data) => {
        if (data !== null) {
          result(null, data);
        } else {
          result({ error: "Customer not found" }, null);
        }
      })
      .catch((err) => {
        result(err, null);
      });
  },
  //   changePassword(customerId, result) {
  //     api
  //       .login(SplynxApi.LOGIN_TYPE_API_KEY, {
  //         key: loadedConfig.API_KEY,
  //         secret: loadedConfig.API_SECRET,
  //       })
  //       .then(() => {
  //         api
  //           .get("admin/customers/customer")
  //           .then((custres) => {
  //             const allCustomers = custres.response;

  //             let promises = [];
  //             // for (let r = 0; r <= disconnectList.length - 1; r++) {
  //             // let customerNo = disconnectList[r].customer_id;
  //             // let contact = disconnectList[r].contact;
  //             // let balance = disconnectList[r].balance;
  //             const disconnect = allCustomers.filter(
  //               (customer) => customer.login == customerId
  //             );
  //             console.log(disconnect);
  //             if (disconnect.length > 0) {
  //               const disconnectId = disconnect[0].id;
  //               console.log(customerId, disconnectId, "Splynx customer ID is....that");
  //               api
  //                 .post("/portal/profile/reset-password-request")
  //                 .then(()=>{
  //                   console.log("Catch password Request")
  //                 })
  //                 .catch((err) => {
  //                   result(err, null);
  //                 });
  //             }

  //             //   Promise.all(promises)
  //             //     .then((response) => {
  //             //       result(null, response);
  //             //     })
  //             //     .catch((err) => {
  //             //       result(err, null);
  //             //     });
  //           })
  //         // .catch((err) => {
  //         //   result(err, null);
  //         // });
  //       })
  //       .catch((err) => {
  //         result(err, null);
  //       });
  //   },
  //   initiateStk(customer, result) {
  //     const mpesa = new MpesaController();
  //     // const url =
  //     //   "https://admin.mawingunetworks.com/c2b-interface/callback-m-pesa-rest-api";
  //     // // const PhoneNumber: cleanPhone(dbCustomer.phone).replace('+', '')
  //     // let description =
  //     //   "MawinguApp-" + new Date().getTime();
  //     // mpesa
  //     //   .sktPush(customer.price, customer.phone, description, url)
  //     //   .then((resp) => {
  //     //     console.log("Successfully pushed");
  //     //     // result(null, {
  //     //     //   message: "success",
  //     //     // });
  //     //   })
  //     //   .catch((err) => {
  //     //     console.log("Unsuccessfully pushed ", err);
  //     //     // result(err, null);
  //     //   });

  //     // consumer_key: process.env.consumer_key,
  //     //         consumer_secret: process.env.consumer_secret,
  //     //         passkey: process.env.passkey,
  //     //         BusinessShortCode: process.env.BusinessShortCode,
  //     //         LipaShortCode: process.env.LipaShortCode,
  //     //         ShortCode: process.env.ShortCode,
  //     //         SecurityCredential: "",
  //     //         Initiator: "",
  //     //         callBackBaseUrl: process.env.callBackBaseUrl
  //     mpesa
  //       .sktPush(customer.price, /* 1000 is an example amount */
  //         customer.phone,
  //         "TestTransaction",
  //         "https://admin.mawingunetworks.com/c2b-interface/callback-m-pesa-rest-api"
  //       )
  //       .then((response) => {
  //         //Do something with the response
  //         //eg
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         //Do something with the error;
  //         //eg
  //         console.error(error);
  //       });
  //   },
};
