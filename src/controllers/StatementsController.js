const sequelize = require("sequelize");
const Op = sequelize.Op;

const Statement = require("../../models").Statement;
const Customer = require("../../models").Customer;

const {
  createError,
  validatePaymentInput,
  cleanPhone,
  isEmpty,
} = require("../validation");

module.exports = {
    //get statements based on customer id, start and end dates 
    getStatements(customer_id, start_date, end_date, result) {
      console.log("customer_id",customer_id)
      Statement.findAll({
        where : { [Op.and]: [
                          { posting_date: {[Op.between] : [start_date , end_date ]}},
                          { customer_no: customer_id }
              ]}}
      )
        .then((statements) => {
          // console.log("Processing")
          result(null, statements);
        })
        .catch((err) => {
          result(err, null);
        });
    },
  
};
