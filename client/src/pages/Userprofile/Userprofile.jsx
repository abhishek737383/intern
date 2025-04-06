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

export default function Userprofile({ slidein }) {
  const { id } = useParams();
  const users = useSelector(state => state.usersreducer);
  const currentuser = useSelector(state => state.currentuserreducer);
  const currentprofile = users.find(u => u._id === id) || {};

  const [notificationsEnabled, setNotificationsEnabled] =
    useLocalStorage('notificationsEnabled', false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (notificationsEnabled && Notification.permission === 'default') {
      requestNotificationPermission();
    }
  }, [notificationsEnabled]);

  const handleToggle = () => {
    const enabled = !notificationsEnabled;
    setNotificationsEnabled(enabled);
    if (enabled) requestNotificationPermission();
  };

  const isOwner = currentuser?.result?._id === id;

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
                  Joined{' '}
                  {currentprofile?.joinedon &&
                    new Date(currentprofile.joinedon).toLocaleDateString()}
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
                  onClick={handleToggle}
                  title={
                    notificationsEnabled
                      ? 'Disable Notifications'
                      : 'Enable Notifications'
                  }
                >
                  <FontAwesomeIcon
                    icon={notificationsEnabled ? faBell : faBellSlash}
                  />{' '}
                  {notificationsEnabled ? 'On' : 'Off'}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <Editprofileform currentuser={currentuser} setswitch={setIsEditing} />
          ) : (
            <Profilebio currentprofile={currentprofile} />
          )}
        </section>
      </div>
    </div>
  );
}
