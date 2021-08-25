const Feedback = require("../../models").Feedback;

module.exports = {
  getAllFeedbacks(result) {
    Feedback.findAll()
      .then((feedbacks) => {
        result(null, feedbacks);
      })
      .catch((error) => result(error, null));
  },
  saveFeedback(feedback, result) {
    Feedback.create({
      easyToUse: feedback.easyToUse,
      satisfication: feedback.satisfication,
      correctAcount: feedback.correctAcount,
      comment: feedback.comment,
      user: feedback.user,
    })
      .then(() => {
        result(null, { message: "success" });
      })
      .catch((error) => {
        result(error, null);
      });
  },
};
