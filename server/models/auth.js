import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedon: { type: Date, default: Date.now },
  points: { type: Number, default: 0 } // <-- New field for reward points
});

export default mongoose.model("User", userschema);
