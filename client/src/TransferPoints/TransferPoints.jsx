import React, { useState } from "react";
import { useSelector } from "react-redux";
import { transferPoints } from "../../api";

export default function TransferPoints({ currentUserId }) {
  const [recipient, setRecipient] = useState("");
  const [points, setPoints] = useState("");
  const [message, setMessage] = useState("");

  const users = useSelector((state) => state.usersreducer);
  const currentUser = users.find((u) => u._id === currentUserId);

  const handleTransfer = async () => {
    const toUser = users.find((u) => u.name === recipient);

    if (!toUser) {
      setMessage("User not found.");
      return;
    }

    if (currentUser.points < 10) {
      setMessage("You need at least 10 points to transfer.");
      return;
    }

    if (parseInt(points) <= 0 || currentUser.points < parseInt(points)) {
      setMessage("Invalid amount.");
      return;
    }

    try {
      await transferPoints(currentUserId, toUser._id, parseInt(points));
      setMessage(`Successfully transferred ${points} points to ${toUser.name}.`);
      setRecipient("");
      setPoints("");
    } catch (err) {
      setMessage("Transfer failed.");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Recipient Username"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Points to Transfer"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>
      <p style={{ color: "green" }}>{message}</p>
    </div>
  );
}
