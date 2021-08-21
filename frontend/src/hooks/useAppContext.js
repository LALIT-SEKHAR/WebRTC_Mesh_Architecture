import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [Data, setData] = useState();

  const updateData = (newState) => {
    setData(newState);
  };

  return (
    <AppContext.Provider value={{ Data, updateData }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const { Data, upDataState } = useContext(AppContext);
  return { Data, upDataState };
};

export default useAppContext;
