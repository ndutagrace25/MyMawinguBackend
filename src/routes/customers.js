const { response } = require("express");
const express = require("express");
const router = express.Router();

const { CustomersController } = require("../controllers");

// // Get customers
// router.get("/", (req, res) => {
//   CustomersController.getCustomers((err, customers) => {
//     if (err) {
//       res.status(400).json(err);
//     } else {
//       res.status(200).json(customers);
//     }
//   });
// });

// // Login customer
router.post("/login", (req, res) => {
  CustomersController.loginCustomer(req.body.customer, (err, data) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

// router.post("/buystk", (req, res) => {
//   CustomersController.initiateStk(req.body, req.user, (err, customer) => {
//     if (err) {
//       //console.log(err);
//       res.status(400).json(err);
//     } else {
//       //console.log(customer);
//       res.status(200).json(customer);
//     }
//   });
// });

// // router.post("/buystk", passport.authenticate("jwt", {
// //   session: false
// // }), (req, res) => {

// // Test Change Password
// customerId = "COR000000046";
// CustomersController.changePassword(customerId, (err, customers) => {
//   if (err) {
//     // res.status(400).json(err);
//   } else {
//     res.status(200).json(customers);
//   }
// });

module.exports = router;
