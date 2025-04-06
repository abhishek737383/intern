// src/components/NotificationToggle/NotificationToggle.js
import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const NotificationToggle = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notificationsEnabled', true);

  const handleToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="notification-toggle" style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
      <label>
        <input 
          type="checkbox" 
          checked={notificationsEnabled} 
          onChange={handleToggle} 
        />
        {notificationsEnabled ? ' Notifications Enabled' : ' Notifications Disabled'}
      </label>
    </div>
  );
};

export default NotificationToggle;
