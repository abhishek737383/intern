// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import socket from "./services/socket";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  requestNotificationPermission,
  sendNotification
} from "./services/NotificationService";
import { subscribeToNotifications } from "./services/socketNotifications";
import { fetchallusers } from "./action/users";
import { fetchallquestion } from "./action/question";
import Navbar from "./Comnponent/Navbar/navbar";
import Allroutes from "./Allroutes";
import "./App.css";

function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.currentuserreducer);
  const [slidein, setSlidein] = useState(window.innerWidth > 768);
  const [notificationsEnabled] = useLocalStorage("notificationsEnabled", false);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchallusers());
    dispatch(fetchallquestion());
  }, [dispatch]);

  // Handle responsive slidein state
  useEffect(() => {
    const onResize = () => setSlidein(window.innerWidth > 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Setup socket connection for authenticated users
  useEffect(() => {
    if (user?.result?._id) {
      socket.auth = { token: user.token };
      socket.connect();
      socket.on("connect", () => {
        socket.emit("joinUserRoom", user.result._id);
      });
      socket.on("connect_error", console.error);
    }
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user]);

  // Subscribe to notifications if enabled
  useEffect(() => {
    if (!notificationsEnabled) return;
    let unsubscribe;
    let lastNotifId = null;

    requestNotificationPermission().then(permission => {
      if (permission !== "granted") return;

      unsubscribe = subscribeToNotifications(payload => {
        // Avoid duplicate notifications with the same ID
        if (payload.notifId === lastNotifId) return;
        lastNotifId = payload.notifId;
        sendNotification(payload.title, { body: payload.body });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [notificationsEnabled]);

  const handleSlidein = () => {
    if (window.innerWidth <= 768) {
      setSlidein(prev => !prev);
    }
  };

  return (
    <div className="App">
      <Navbar handleslidein={handleSlidein} />
      <Allroutes slidein={slidein} handleslidein={handleSlidein} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
