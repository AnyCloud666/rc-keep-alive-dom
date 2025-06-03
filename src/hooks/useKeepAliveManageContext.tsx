import { createContext, useContext } from 'react';
import { RCKeepAlive } from '../typing';

export const KeepAliveManageContext =
  createContext<RCKeepAlive.KeepAliveManageContextProps>({});

export const useKeepAliveManageContext = () => {
  return useContext(KeepAliveManageContext);
};
