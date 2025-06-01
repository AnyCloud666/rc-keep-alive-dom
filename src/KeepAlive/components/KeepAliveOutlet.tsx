import { useOutlet } from 'dumi';
import React, { memo } from 'react';
import { RCKeepAlive } from '../typing';
import KeepAlive from './KeepAlive';

const KeepAliveOutlet = memo((props: RCKeepAlive.KeepAliveProps) => {
  const outlet = useOutlet();
  return <KeepAlive {...props}>{outlet}</KeepAlive>;
});

export default KeepAliveOutlet;
