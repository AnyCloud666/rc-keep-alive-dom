import React, { memo } from 'react';
import { KeepAliveContext } from '../hooks/useKeepAliveContext';
import { RCKeepAlive } from '../typing';

const KeepAliveProvider = memo((props: RCKeepAlive.KeepAliveProviderProps) => {
  const { children } = props;

  return (
    <KeepAliveContext.Provider value={props}>
      {children}
    </KeepAliveContext.Provider>
  );
});

export default KeepAliveProvider;
