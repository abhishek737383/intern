// backend/controllers/questionController.js
import Question from "../models/Question.js";
import mongoose from "mongoose";
import User from "../models/auth.js"; // Ensure you have a User model

// ASK A QUESTION
export const Askquestion = async (req, res) => {
  const postquestiondata = req.body;
  const userid = req.userid; // Set by your auth middleware
  const postquestion = new Question({ ...postquestiondata, userid });
  
  try {
    await postquestion.save();
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.error(error);
    res.status(404).json("Couldn't post a new question");
  }
};

// GET ALL QUESTIONS
export const getallquestion = async (req, res) => {
  try {
    const questionlist = await Question.find().sort({ askedon: -1 });
    res.status(200).json(questionlist);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

// DELETE A QUESTION
export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    await Question.findByIdAndDelete(_id);
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

// VOTE ON A QUESTION
export const votequestion = async (req, res) => {
  const { id: questionId } = req.params;
  const { value } = req.body; // "upvote" or "downvote"
  const voterId = req.userid; // Set by your auth middleware

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    // 1) Fetch the question
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).send("Question not found");

    // 2) Apply up/down‑vote logic
    const hasUp = question.upvote.includes(String(voterId));
    const hasDown = question.downvote.includes(String(voterId));

    if (value === "upvote") {
      if (hasDown) question.downvote = question.downvote.filter(id => id !== String(voterId));
      if (!hasUp) question.upvote.push(voterId);
      else question.upvote = question.upvote.filter(id => id !== String(voterId));
    } else if (value === "downvote") {
      if (hasUp) question.upvote = question.upvote.filter(id => id !== String(voterId));
      if (!hasDown) question.downvote.push(voterId);
      else question.downvote = question.downvote.filter(id => id !== String(voterId));
    }

    await question.save();

    // 3) Look up the voter's name
    const voter = await User.findById(voterId, "name");
    const voterName = voter ? voter.name : "Someone";

    // 4) Emit a notification to the question owner
    const io = req.app.get("io");
    io.to(`user_${question.userid}`).emit("voteUpdate", {
      title: `${voterName} ${value}d your question`,
      body: question.title || "", // Use the question title if available
      questionId,
      notifId: Date.now() // Use a timestamp or another unique value
    });

    return res.status(200).json({ message: "Voted successfully" });
  } catch (err) {
    console.error("Error voting on question:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
