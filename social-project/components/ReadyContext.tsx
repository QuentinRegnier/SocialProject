import React, { createContext, useContext, useState, useMemo } from 'react';

const pagesToLoad = ['main', 'post-image-text'];

type ReadyContextType = {
  pagesReady: Record<string, boolean>;
  setPageReady: (page: string, ready: boolean) => void;
  appReady: boolean;
};

const ReadyContext = createContext<ReadyContextType>({
  pagesReady: {},
  setPageReady: () => {},
  appReady: false,
});

export const useReady = () => useContext(ReadyContext);

export const ReadyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pagesReady, setPagesReady] = useState<Record<string, boolean>>({});

  const setPageReady = (page: string, ready: boolean) => {
    setPagesReady(prev => ({ ...prev, [page]: ready }));
  };

  const appReady = useMemo(() => {
    return pagesToLoad.every(page => pagesReady[page]);
  }, [pagesReady]);

  return (
    <ReadyContext.Provider value={{ pagesReady, setPageReady, appReady }}>
      {children}
    </ReadyContext.Provider>
  );
};

export default ReadyProvider;