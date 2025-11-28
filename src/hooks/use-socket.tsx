"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./use-auth";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinUserRoom: (userId: number) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only initialize socket if user is authenticated
    if (!user?.id) {
      console.log("⚠️  No user authenticated, skipping socket connection");
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log(`🔌 Initializing socket connection to ${socketUrl}`);

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log(`✅ Socket connected: ${newSocket.id}`);
      setIsConnected(true);

      // Automatically join user's room upon connection
      if (user?.id) {
        console.log(`📍 Joining room for user ${user.id}`);
        newSocket.emit("join", { userId: user.id });
      }
    });

    newSocket.on("joined", (data: { userId: number; roomName: string; timestamp: string }) => {
      console.log(`✅ Successfully joined room:`, data);
    });

    newSocket.on("disconnect", (reason: string) => {
      console.log(`⚠️  Socket disconnected: ${reason}`);
      setIsConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber: number) => {
      console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      // Rejoin room after reconnection
      if (user?.id) {
        console.log(`📍 Rejoining room for user ${user.id}`);
        newSocket.emit("join", { userId: user.id });
      }
    });

    newSocket.on("connect_error", (error: Error) => {
      console.error(`❌ Socket connection error: ${error.message}`);
      setIsConnected(false);
    });

    newSocket.on("error", (error: { message: string }) => {
      console.error(`❌ Socket error:`, error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.close();
    };
  }, [user?.id]);

  const joinUserRoom = useCallback((userId: number) => {
    if (socket && isConnected) {
      console.log(`📍 Manually joining room for user ${userId}`);
      socket.emit("join", { userId });
    } else {
      console.warn("⚠️  Cannot join room - socket not connected");
    }
  }, [socket, isConnected]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinUserRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook for easy access to socket
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return ctx;
};
