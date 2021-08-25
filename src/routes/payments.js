const express = require("express");
const router = express.Router();
const axios = require("axios");
const { PaymentsController } = require("../controllers");

router.post("/buystk", (req, res) => {
  PaymentsController.initiateStk(req.body, (err, customer) => {
    if (err) {
      //console.log(err);
      res.status(400).json(err);
    } else {
      //console.log(customer);
      res.status(200).json(customer);
    }
  });
});
router.post("/callback-m-pesa-rest-api", (req, res) => {
  const data = req.body;
  // console.log(data);
  PaymentsController.confirmStk(data, (err, payment) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(payment);
    }
  });
});
module.exports = router;
