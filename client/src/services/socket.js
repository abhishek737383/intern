// src/services/socket.js
import { io } from "socket.io-client";

const URL = process.env.REACT_APP_API_URL || "https://intern-dyia.onrender.com";
const socket = io(URL, {
  autoConnect: false,
  transports: ["polling", "websocket"],
  withCredentials: true
});

export default socket;
