import React, { createContext, useContext } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export default StoreContext;

