import api, { API_BASE_URL } from "../lib/api";

import { io } from "socket.io-client";

// Create a single socket instance but do not auto-connect. ChatBoard will
// connect/disconnect explicitly to avoid duplicate connection attempts which
// can cause "WebSocket is closed before the connection is established" errors
// when multiple components try to control the socket lifecycle.
export const socket = io(API_BASE_URL, {
  withCredentials: true,
  autoConnect: false,
  // sensible reconnection policy
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
});

// Debugging helpers: log connection lifecycle so we can verify the handshake
// and whether cookies are sent by the browser.
socket.on('connect', () => {
  console.log('[socket] connected, id=', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('[socket] connect_error', err?.message || err);
});

socket.on('disconnect', (reason) => {
  console.log('[socket] disconnected, reason=', reason);
});

socket.on('reconnect_attempt', (attempt) => {
  console.log('[socket] reconnect_attempt', attempt);
});