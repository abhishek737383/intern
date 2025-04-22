import React, { useEffect, useState } from 'react';
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from '../../Comnponent/Avatar/Avatar';
import Editprofileform from './Edirprofileform';
import Profilebio from './Profilebio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { requestNotificationPermission } from '../../services/NotificationService';
import { transferPoints } from '../../api'; // reward system API for transferring points

const Userprofile = ({ slidein }) => {
  const { id } = useParams();
  const users = useSelector(state => state.usersreducer);
  const currentuser = useSelector(state => state.currentuserreducer);
  const currentprofile = users.find(u => u._id === id) || {};

  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notificationsEnabled', false);

  // State for transfer points form
  const [recipientId, setRecipientId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const isOwner = currentuser?.result?._id === id;

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    // Check if user has more than 10 points
    if (currentprofile.points < 10) {
      alert("You need at least 10 points to transfer.");
      return;
    }
    if (!recipientId.trim()) {
      alert("Please select a recipient.");
      return;
    }
    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) {
      alert("Enter a valid points amount to transfer.");
      return;
    }
    if (Number(transferAmount) > currentprofile.points) {
      alert("You cannot transfer more points than you currently have.");
      return;
    }
    try {
      // Call the API to perform transfer
      const response = await transferPoints(currentuser.result._id, recipientId, Number(transferAmount));
      if (response.data.success) {
        alert("Points transferred successfully!");
        // Optionally update state or refetch user profile data here.
      }
    } catch (error) {
      console.error("Error transferring points:", error);
      alert("Failed to transfer points. Please try again.");
    }
  };

  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="40px"
                py="30px"
              >
                {currentprofile.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentprofile?.name}</h1>
                <p>
                  Joined{" "}
                  {currentprofile?.joinedon &&
                    new Date(currentprofile.joinedon).toLocaleDateString()}
                </p>
                <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                  Points: {currentprofile?.points || 0}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="actions-right">
                <button
                  className="edit-profile-btn"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Profile
                </button>
                <button
                  className="notification-toggle"
                  onClick={() => {
                    const enabled = !notificationsEnabled;
                    setNotificationsEnabled(enabled);
                    if (enabled) requestNotificationPermission();
                  }}
                  title={
                    notificationsEnabled
                      ? "Disable Notifications"
                      : "Enable Notifications"
                  }
                >
                  <FontAwesomeIcon icon={notificationsEnabled ? faBell : faBellSlash} />{" "}
                  {notificationsEnabled ? "On" : "Off"}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <Editprofileform currentuser={currentuser} setswitch={setIsEditing} />
          ) : (
            <Profilebio currentprofile={currentprofile} />
          )}

          {/* Transfer Points Section (Visible only to owner) */}
          {isOwner && (
            <div className="transfer-points-section" style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
              <h3>Transfer Points</h3>
              <form onSubmit={handleTransferSubmit}>
                <div>
                  <label htmlFor="recipient">Select Recipient:</label>
                  <select
                    id="recipient"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                  >
                    <option value="">--Select User--</option>
                    {users
                      .filter((u) => u._id !== currentuser.result._id)
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="amount">Points to Transfer:</label>
                  <input
                    type="number"
                    id="amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <button type="submit" style={{ marginTop: "10px" }}>
                  Transfer
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Userprofile;
