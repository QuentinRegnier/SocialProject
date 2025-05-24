// context/ReadyContext.tsx
import React, { createContext, useContext, useState } from 'react';

type ReadyContextType = {
  screenReady: boolean;
  setScreenReady: (ready: boolean) => void;
};

const ReadyContext = createContext<ReadyContextType>({
  screenReady: false,
  setScreenReady: () => {},
});

export const useReady = () => useContext(ReadyContext);

export const ReadyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenReady, setScreenReady] = useState(false);

  return (
    <ReadyContext.Provider value={{ screenReady, setScreenReady }}>
      {children}
    </ReadyContext.Provider>
  );
}; 
export default ReadyProvider;