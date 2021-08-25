const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePaymentInput(data) {
  let errors = {};
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.accountno = !isEmpty(data.accountno) ? data.accountno : "";

  if (validator.isEmpty(data.phone)) {
    errors.phone = "Phone is required";
  }
  //   if (validator.isEmpty(data.amount)) {
  //     errors.amount = "amount is required";
  //   }
  if (validator.isEmpty(data.accountno)) {
    errors.accountno = "accountno is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
