// src/services/socketNotifications.js
import socket from "./socket";

/**
 * Subscribe to notification events.
 * Returns an unsubscribe function.
 */
export function subscribeToNotifications(handler) {
  socket.on("newAnswer", handler);
  socket.on("voteUpdate", handler);

  return () => {
    socket.off("newAnswer", handler);
    socket.off("voteUpdate", handler);
  };
}
