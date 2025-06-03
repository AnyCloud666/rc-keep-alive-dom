import { createContext, useContext } from 'react';
import { RCKeepAlive } from '../typing';

export const KeepAliveContext =
  createContext<RCKeepAlive.KeepAliveContextProps>(
    {} as RCKeepAlive.KeepAliveContextProps,
  );

export const useKeepAliveContext = () => {
  return useContext(KeepAliveContext);
};
