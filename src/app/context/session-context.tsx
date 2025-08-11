"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
export type SessionData = {
  id: string;
  users: User[];
  items: Item[];
};

export type User = {
  id: string;
  name: string;
  allocatedItems: Item[];
  isReady?: boolean; // Optional property to indicate if the user is ready
};

export type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// Define the shape of your context data
interface SessionContextType {
  session: SessionData; // Change 'any' to your actual session type
  setSession: React.Dispatch<React.SetStateAction<SessionData>>;
}

// Create the context with default value null (or you can set default session value)
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider props type
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<SessionData>({
    id: "",
    users: [],
    items: [],
  });

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to use the SessionContext and ensure it is used within a provider
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
