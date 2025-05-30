import { memo } from 'react';
import KeepAlive from './KeepAlive';

const MemoizedKeepAlive = memo(KeepAlive, (pre, next) => {
  return pre.activeName === next.activeName;
});

export default MemoizedKeepAlive;
