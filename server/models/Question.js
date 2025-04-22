import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  answerbody: String,
  useranswered: String,
  userid: String,
  answeredon: { type: Date, default: Date.now },
  upvote: { type: [String], default: [] },     // ← Per‑answer upvotes
  downvote: { type: [String], default: [] }    // ← Per‑answer downvotes
});

const questionSchema = new mongoose.Schema({
  questiontitle: { type: String, required: true },
  questionbody: { type: String, required: true },
  questiontags: { type: [String], required: true },
  noofanswers: { type: Number, default: 0 },
  upvote: { type: [String], default: [] },
  downvote: { type: [String], default: [] },
  userposted: { type: String, required: true },
  userid: String,
  askedon: { type: Date, default: Date.now },
  answer: [answerSchema]                       // ← Embedded answer documents
});

export default mongoose.model("Question", questionSchema);
