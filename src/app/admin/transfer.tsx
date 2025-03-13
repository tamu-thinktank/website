"use client";

import React from "react";

// Create a proper type for the context value
type MemberContextType = null; // Replace with your actual context type

const MemberContext = React.createContext<MemberContextType>(null);

export const useMemberContext = () => React.useContext(MemberContext);

interface MemberProviderProps {
  children: React.ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  // Add member context logic here if needed
  return (
    <MemberContext.Provider value={null}>{children}</MemberContext.Provider>
  );
};
