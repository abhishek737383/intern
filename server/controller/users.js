import mongoose from "mongoose";
import User from "../models/auth.js";

export const getallusers = async (req, res) => {
  try {
    const allusers = await User.find();
    const alluserdetails = allusers.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      tags: user.tags,
      joinedon: user.joinedon,
      points: user.points  // Optionally, include points if needed
    }));
    res.status(200).json(alluserdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("User unavailable");
  }

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { $set: { name, about, tags } },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
