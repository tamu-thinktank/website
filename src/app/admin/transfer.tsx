import React, { createContext, useState, useContext } from 'react';
import { ApplicantData } from './interviewees/intervieweetypes';

interface MemberContextType {
  members: ApplicantData[];
  setMembers: React.Dispatch<React.SetStateAction<ApplicantData[]>>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<ApplicantData[]>([]);

  return (
    <MemberContext.Provider value={{ members, setMembers }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};
