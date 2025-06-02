import React, { memo, Suspense, useMemo } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { RCKeepAlive } from '../typing';
import KeepAlive from './KeepAlive';

const KeepAliveOutlet = memo((props: RCKeepAlive.KeepAliveOutletProps) => {
  const outlet = useOutlet();
  const location = useLocation();
  const activeName = useMemo(() => {
    return location.pathname + location.search;
  }, [location]);
  return (
    <KeepAlive activeName={activeName} {...props}>
      <Suspense>{outlet}</Suspense>
    </KeepAlive>
  );
});

export default KeepAliveOutlet;
