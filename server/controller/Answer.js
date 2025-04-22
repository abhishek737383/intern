// backend/controllers/answerController.js
import mongoose from "mongoose";
import Question from "../models/Question.js";
import User from "../models/auth.js"; // to look up voter’s name

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
      { $push: { answer: { answerbody, useranswered, userid } } },
      { new: true }
    );

    // 3. Emit socket notification to question owner
    const io = req.app.get("io");
    if (updatedQuestion && updatedQuestion.userid) {
      io.to(`user_${updatedQuestion.userid}`).emit("newAnswer", {
        title: `${useranswered} answered your question`,
        body: answerbody,
        questionId,
        notifId: Date.now()
      });
    }

    return res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error in posting answer:", error);
    return res.status(500).json({ message: "Error in posting answer" });
  }
};

// DELETE AN ANSWER
const updatenoofquestion = async (questionId, noofanswers) => {
  try {
    await Question.findByIdAndUpdate(questionId, {
      $set: { noofanswers }
    });
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
    // 1. Update answer count
    await updatenoofquestion(questionId, noofanswers);

    // 2. Remove the answer
    await Question.updateOne(
      { _id: questionId },
      { $pull: { answer: { _id: answerid } } }
    );

    return res.status(200).json({ message: "Successfully deleted." });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return res.status(500).json({ message: "Error deleting answer" });
  }
};

// VOTE ANSWER
export const voteAnswer = async (req, res) => {
  const { id: questionId } = req.params;    // questionId
  const { answerId, value } = req.body;     // "upvote" | "downvote"
  const voterId = req.userid;               // from auth middleware

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable");
  }

  try {
    // 1. Fetch question + answer subdoc
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).send("Question not found");

    const ans = question.answer.id(answerId);
    if (!ans) return res.status(404).send("Answer not found");

    // 2. Up/down‑vote logic
    const hasUp = ans.upvote.includes(voterId);
    const hasDown = ans.downvote.includes(voterId);

    if (value === "upvote") {
      if (hasDown) ans.downvote = ans.downvote.filter(u => u !== voterId);
      hasUp
        ? (ans.upvote = ans.upvote.filter(u => u !== voterId))
        : ans.upvote.push(voterId);
    } else { // downvote
      if (hasUp) ans.upvote = ans.upvote.filter(u => u !== voterId);
      hasDown
        ? (ans.downvote = ans.downvote.filter(u => u !== voterId))
        : ans.downvote.push(voterId);
    }

    // 3. Save changes
    await question.save();

    // 4. Look up voter’s name for notification
    let voterName = "Someone";
    try {
      const voter = await User.findById(voterId, "name");
      if (voter && voter.name) voterName = voter.name;
    } catch (err) {
      console.warn("Could not look up voter name:", err);
    }

    // 5. Emit notification to the answer’s owner
    const io = req.app.get("io");
    const answerOwnerId = ans.userid;
    if (answerOwnerId) {
      const verb = value === "upvote" ? "upvoted" : "downvoted";
      io.to(`user_${answerOwnerId}`).emit("voteUpdate", {
        title: `${voterName} ${verb} your answer`,
        body: question.questiontitile?.slice(0, 50) || "",
        questionId,
        notifId: Date.now()
      });
    }

    return res.status(200).json({ message: "Answer voted successfully" });
  } catch (err) {
    console.error("Error in voteAnswer:", err);
    return res.status(500).json({ message: err.message });
  }
};
