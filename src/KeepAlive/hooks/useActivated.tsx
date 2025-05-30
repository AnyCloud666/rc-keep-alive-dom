import { useEffect, useRef } from 'react';
import { useKeepAliveContext } from '../Context/KeepAliveContext';

/**
 * 页面激活执行回调函数
 *
 * @param {() => void} callback
 */
const useActivated = (callback: () => void) => {
  const { active } = useKeepAliveContext();
  const isMount = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (!isMount.current) {
      isMount.current = true;
      return;
    }
    callback?.();
  }, [active]);
};
export default useActivated;
