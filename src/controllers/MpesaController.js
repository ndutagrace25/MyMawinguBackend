"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true,
});
const axios = require("axios");
const adapter = require("axios/lib/adapters/http");
const { cleanPhone } = require("../validation");
class Mpesa {
  constructor() {
    const options = {
      consumer_key: "EtxmQ0tnFVEl1MFqZqjYpx3e5bs904gU",
      consumer_secret: "HOxiKCmSrML57k9G",
      passkey:
        "cbb0969b89d290254cd70f11734ef19fcc63973552f1e2766852eb5472cbfea0",
      BusinessShortCode: 579950,
      LipaShortCode: 579950,
      ShortCode: 579950,
      SecurityCredential: "",
      Initiator: "",
      callBackBaseUrl: "https://mymawingu-app-backend.mawingunetworks.com",
    };
    this.AuthToken = "";
    this.consumer_key = options.consumer_key;
    this.consumer_secret = options.consumer_secret;
    this.passkey = options.passkey;
    this.BusinessShortCode = options.BusinessShortCode;
    this.LipaShortCode = options.LipaShortCode;
    this.ShortCode = options.ShortCode;
    this.SecurityCredential = options.SecurityCredential;
    this.Initiator = options.Initiator;
    this.callBackBaseUrl = options.callBackBaseUrl;
    this.stkBuyTransactionType = "CustomerPayBillOnline";
    this.QueueTimeOutURL = `${this.callBackBaseUrl}/queue`;
    this.getCallbackByCategory = options.mpesaLipaTransaction;
    this.ResultURL = `${this.callBackBaseUrl}/result`;
    this.CallBackURL = `${this.callBackBaseUrl}/stkpushResult`;
    this.ConfirmationURL = `${this.callBackBaseUrl}/confirm`;
    this.ValidationURL = `${this.callBackBaseUrl}/validate`;
    this._accountBalanceURL =
      "https://api.safaricom.co.ke/mpesa/accountbalance/v1/query";
    this._authURL =
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    this._stkURL =
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    this._stkCheckURL =
      "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query";
    this._c2bRegisterURL =
      "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    this._c2bSimulateURL = " https://api.safaricom.co.ke/mpesa/c2b/v1/simulate";
    this._b2cURL = "https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  }
  //  AUTH Request
  //  Use this API to generate an OAuth access token to access other APIs
  async _getAuthToken() {
    let auth =
      "Basic " +
      Buffer.from(this.consumer_key + ":" + this.consumer_secret).toString(
        "base64"
      );
    try {
      let res = await axios.get(this._authURL, {
        headers: {
          Authorization: auth,
        },
      });

      let { access_token } = res.data;
      if (access_token) {
        this.AuthToken = access_token;
      }
    } catch (error) {
      // console.log("an error ocured when hgenerating access token");
      // console.log(error);
      this.AuthToken = "";
      // console.error(error.response.data.errorMessage);
    }
    return this.AuthToken;
  }
  pad2(n) {
    return n < 10 ? "0" + n : n;
  }
  async _setHeaders() {
    let access_token = await this._getAuthToken();
    console.log({ access_token });
    axios.defaults.headers = {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    };
  }
  _generateTimeStamp() {
    var date = new Date();
    return (
      date.getFullYear().toString() +
      this.pad2(date.getMonth() + 1) +
      this.pad2(date.getDate()) +
      this.pad2(date.getHours()) +
      this.pad2(date.getMinutes()) +
      this.pad2(date.getSeconds())
    );
  }

  _generatePassword() {
    let Timestamp = this._generateTimeStamp();
    return Buffer.from(
      this.BusinessShortCode + this.passkey + Timestamp
    ).toString("base64");
  }

  // Lipa Na M-Pesa Online Payment API
  // Use this API to initiate online payment on behalf of a customer.
  sktPush(amount, phonenumber, transactiondesc, url) {
    return new Promise(async (resolve, reject) => {
      if (!amount) reject(new Error("Must provide an amount"));
      if (!phonenumber) reject(new Error("Must provide a PhoneNumber"));
      // if (accountreference)
      //     reject(new Error("Must provide an AccountReference"));
      if (!transactiondesc) reject(new Error("Must provide a TransactionDesc"));

      let headers = await this._setHeaders();
      // console.log({ headers });
      var timestamp = this._generateTimeStamp();
      var password = this._generatePassword();
      let requestBody = {
        BusinessShortCode: this.ShortCode,
        TransactionType: this.stkBuyTransactionType,
        PartyB: this.ShortCode,
        CallBackURL: this.CallBackURL,
        CallBackURL: url,
        Amount: amount,
        PartyA: cleanPhone(phonenumber).replace("+", ""),
        PhoneNumber: cleanPhone(phonenumber).replace("+", ""),
        AccountReference: transactiondesc,
        TransactionDesc: transactiondesc,
        Timestamp: timestamp,
        Password: password,
      };
      let data = JSON.stringify(requestBody);
      // console.log(data);
      axios({
        method: "POST",
        url: this._stkURL,
        data,
        // adapter
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          // console.log(error);
          reject(error.message);
        });
    });
  }

  // Lipa Na M-Pesa Query Request API
  // Use this API to check the status of a Lipa Na M-Pesa Online Payment.
  stkCheck(CheckoutRequestID) {
    return new Promise(async (resolve, reject) => {
      if (!CheckoutRequestID)
        reject(new Error("Must provide an CheckoutRequestID"));
      let headers = await this._setHeaders();
      let requestBody = {
        BusinessShortCode: this.BusinessShortCode,
        CheckoutRequestID,
        Timestamp: this._generateTimeStamp(),
        Password: this._generatePassword(),
      };
      let data = JSON.stringify(requestBody);
      try {
        axios({
          method: "POST",
          url: this._stkCheckURL,
          data,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      } catch (error) {
        reject(error.response.data);
      }
    }).catch((error) => {
      //console.log(error);
    });
  }

  // C2B Register URL
  // Use this API to register validation and confirmation URLs on M-Pesa
  c2bRegister(ConfirmationURL, ValidationURL, ResponseType, ShortCode) {
    return new Promise(async (resolve, reject) => {
      if (!ConfirmationURL) reject(new Error("Must provide a ConfirmationURL"));
      if (!ValidationURL) reject(new Error("Must provide a ValidationURL"));
      if (!ResponseType) reject(new Error("Must provide a ResponseType"));
      if (!ShortCode) reject(new Error("Must provide a ShortCode"));
      let headers = await this._setHeaders();
      let requestBody = {
        ShortCode,
        ResponseType,
        ConfirmationURL,
        ValidationURL,
      };
      let data = JSON.stringify(requestBody);
      try {
        axios({
          method: "POST",
          url: this._c2bRegisterURL,
          data,
        })
          .then((res) => resolve(res.data))
          .catch((error) => {
            reject(error.response.data);
          });
      } catch (error) {
        reject(error);
      }
    }).catch((error) => {
      //console.log(error);
    });
  }

  // C2B Simulate Transaction
  // This API is used to make payment requests from Client to Business (C2B).
  // You can use the sandbox provided test credentials down below to simulates a payment made from the client phone's STK/SIM Toolkit menu, and enables you to receive the payment requests in real time.
  c2bTransactPayBill(CommandID, Amount, Msisdn, BillRefNumber) {
    const ShortCode = process.env.ShortCode;
    return new Promise(async (resolve, reject) => {
      if (!ShortCode) reject(new Error("Must provide a ShortCode"));
      if (!CommandID) reject(new Error("Must provide a CommandID"));
      if (!Amount) reject(new Error("Must provide an Amount"));
      if (!Msisdn) reject(new Error("Must provide a Msisdn"));
      if (!BillRefNumber) reject(new Error("Must provide a BillRefNumber"));
      let headers = await this._setHeaders();
      let requestBody = {
        ShortCode,
        CommandID,
        Amount,
        Msisdn,
        BillRefNumber,
      };
      let data = JSON.stringify(requestBody);
      try {
        axios({
          method: "POST",
          url: this._c2bSimulateURL,
          data,
        })
          .then((res) => resolve(res.data))
          .catch((error) => {
            reject(error.response.data);
          });
      } catch (error) {
        reject(error);
      }
    }).catch((error) => {
      //console.log(error);
    });
  }
  // C2B Simulate Transaction
  // This API is used to make payment requests from Client to Business (C2B).
  // You can use the sandbox provided test credentials down below to simulates a payment made from the client phone's STK/SIM Toolkit menu, and enables you to receive the payment requests in real time.

  c2bTransactTill(CommandID, Amount, Msisdn) {
    const ShortCode = process.env.ShortCode;
    return new Promise(async (resolve, reject) => {
      if (!ShortCode) reject(new Error("Must provide a ShortCode"));
      if (!CommandID) reject(new Error("Must provide a CommandID"));
      if (!Amount) reject(new Error("Must provide an Amount"));
      if (!Msisdn) reject(new Error("Must provide a Msisdn"));
      // if (!BillRefNumber)
      //     reject(new Error("Must provide a BillRefNumber"));
      let headers = await this._setHeaders();
      let requestBody = {
        ShortCode,
        CommandID,
        Amount,
        Msisdn,
      };
      let data = JSON.stringify(requestBody);
      try {
        axios({
          method: "POST",
          url: this._c2bSimulateURL,
          data,
        })
          .then((res) => resolve(res.data))
          .catch((error) => {
            reject(error.response.data);
          });
      } catch (error) {
        reject(error);
      }
    }).catch((error) => {
      //console.log(error);
    });
  }

  // Account Balance Request
  // Use this API to enquire the balance on an M-Pesa BuyGoods (Till Number).
  checkAccountBalance(CommandID, IdentifierType, Remarks) {
    return new Promise(async (resolve, reject) => {
      if (!CommandID) reject(new Error("Must provide a CommandID"));
      if (!IdentifierType) reject(new Error("Must provide an IdentifierType"));
      if (!Remarks) reject(new Error("Must provide a Remarks"));
      let headers = await this._setHeaders();
      let requestBody = {
        Initiator: this.Initiator,
        SecurityCredential: this.SecurityCredential,
        CommandID,
        PartyA: this.ShortCode,
        IdentifierType,
        Remarks,
        QueueTimeOutURL: this.QueueTimeOutURL,
        ResultURL: this.ResultURL,
      };
      let data = JSON.stringify(requestBody);
      try {
        axios({
          method: "POST",
          url: this._accountBalanceURL,
          data,
        })
          .then((res) => resolve(res.data))
          .catch((error) => {
            reject(error.response.data);
          });
      } catch (error) {
        reject(error);
      }
    }).catch((error) => {
      //console.log(error);
    });
  }

  //  B2C Payment Request
  //  Use this API to transact between an M-Pesa short code to a phone number registered on M-Pesa.
  b2c(
    Amount,
    PartyA,
    PartyB,
    Remarks,
    CommandID,
    Occassion,
    SecurityCredential
  ) {
    return new Promise(async (resolve, reject) => {
      if (!Amount) reject(new Error("Must provide a Amount"));
      if (!PartyA) reject(new Error("Must provide a PartyA"));
      if (!PartyB) reject(new Error("Must provide a PartyB"));
      if (!CommandID) reject(new Error("Must provide a CommandID"));
      if (!Occassion) reject(new Error("Must provide a Occassion"));
      if (!Remarks) reject(new Error("Must provide a Remarks"));
      if (!SecurityCredential)
        reject(new Error("Must provide a SecurityCredential"));
      let headers = await this._setHeaders();
      let requestBody = {
        InitiatorName: this.Initiator,
        SecurityCredential,
        CommandID,
        Amount,
        PartyA,
        PartyB,
        Remarks,
        QueueTimeOutURL: this.QueueTimeOutURL,
        ResultURL: this.ResultURL,
        Occassion,
      };
      let data = JSON.stringify(requestBody);
      try {
        axios({
          method: "POST",
          url: this._b2cURL,
          data,
        })
          .then((res) => resolve(res.data))
          .catch((error) => {
            reject(error.response.data);
          });
      } catch (error) {
        reject(error);
      }
    }).catch((error) => {
      //console.log(error);
    });
  }

  /**
   *Use this function to confirm all transactions in callback routes
   */
  finishTransaction(status = true) {
    var resultArray;
    if (status == true) {
      resultArray = {
        ResultDesc: "Accepted",
        ResultCode: "0",
      };
    } else {
      resultArray = {
        ResultDesc: "Rejected",
        ResultCode: "1",
      };
    }

    return resultArray;
  }
}
module.exports = Mpesa;
