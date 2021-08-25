const express = require("express");
const router = express.Router();
const { FeedbackController } = require("../controllers");

// get feedbacks
router.get("/", (req, res) => {
  FeedbackController.getAllFeedbacks((err, feedbacks) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(feedbacks);
    }
  });
});
// post feedback
router.post("/", (req, res) => {
  FeedbackController.saveFeedback(req.body, (err, feedback) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(feedback);
    }
  });
});
module.exports = router;
