// backend/controllers/answerController.js
import mongoose from "mongoose";
import Question from "../models/Question.js";

// POST AN ANSWER
export const postanswer = async (req, res) => {
  const { id: questionId } = req.params;
  const { noofanswers, answerbody, useranswered, userid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    // 1. Update answer count
    await Question.findByIdAndUpdate(questionId, {
      $set: { noofanswers }
    });

    // 2. Add new answer to the array
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        $push: { answer: { answerbody, useranswered, userid } }
      },
      { new: true }
    );

    // 3. Emit socket notification to question owner
    const io = req.app.get("io");
    if (updatedQuestion && updatedQuestion.userid) {
      io.to(`user_${updatedQuestion.userid}`).emit("newAnswer", {
        title: `${useranswered} answered your question`,
        body: answerbody,
        questionId,
        // Optionally include a unique identifier (e.g., timestamp) for deduplication on the client
        notifId: Date.now()
      });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error in posting answer:", error);
    res.status(500).json({ message: "Error in posting answer" });
  }
};

// DELETE AN ANSWER
const updatenoofquestion = async (questionId, noofanswers) => {
  try {
    await Question.findByIdAndUpdate(questionId, { $set: { noofanswers } });
  } catch (error) {
    console.error("Error updating number of answers:", error);
  }
};

export const deleteanswer = async (req, res) => {
  const { id: questionId } = req.params;
  const { answerid, noofanswers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(404).send("Answer unavailable...");
  }

  try {
    await updatenoofquestion(questionId, noofanswers);

    await Question.updateOne(
      { _id: questionId },
      { $pull: { answer: { _id: answerid } } }
    );

    res.status(200).json({ message: "Successfully deleted." });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ message: "Error deleting answer" });
  }
};
