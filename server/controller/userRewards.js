import mongoose from "mongoose";
import User from "../models/auth.js";

// Endpoint: PATCH /user/addpoints/:id
export const addPoints = async (req, res) => {
  const { id } = req.params;
  const { points } = req.body; // Points to add

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("User not found");

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    // Increase points
    user.points = (user.points || 0) + Number(points);
    await user.save();

    res.status(200).json({ success: true, points: user.points });
  } catch (error) {
    console.error("Error adding points:", error);
    res.status(500).json({ message: "Error adding points" });
  }
};

// Endpoint: PATCH /user/reducepoints/:id
export const reducePoints = async (req, res) => {
  const { id } = req.params;
  const { points } = req.body; // Points to deduct

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("User not found");

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    // Deduct points (prevent negative total)
    user.points = Math.max(0, (user.points || 0) - Number(points));
    await user.save();

    res.status(200).json({ success: true, points: user.points });
  } catch (error) {
    console.error("Error reducing points:", error);
    res.status(500).json({ message: "Error reducing points" });
  }
};

// Endpoint: POST /user/transferpoints
export const transferPoints = async (req, res) => {
  // Expecting { fromUserId, toUserId, points } in the request body
  const { fromUserId, toUserId, points } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(fromUserId) ||
      !mongoose.Types.ObjectId.isValid(toUserId)
    ) {
      return res.status(404).send("User not found");
    }

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    if (!fromUser || !toUser) return res.status(404).send("User not found");

    // Ensure the transferring user has at least 10 points and enough points to transfer
    if (fromUser.points < 10 || fromUser.points < Number(points)) {
      return res.status(400).json({ message: "Insufficient points for transfer" });
    }

    // Transfer the points
    fromUser.points = fromUser.points - Number(points);
    toUser.points = (toUser.points || 0) + Number(points);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({
      success: true,
      fromUserPoints: fromUser.points,
      toUserPoints: toUser.points,
    });
  } catch (error) {
    console.error("Error transferring points:", error);
    res.status(500).json({ message: "Error transferring points" });
  }
};
