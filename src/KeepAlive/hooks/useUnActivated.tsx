import { useEffect } from 'react';
import { useKeepAliveContext } from '../Context/KeepAliveContext';

/**
 * 页面切换前执行的回调函数
 *
 * @param {() => void} callback
 * @return {*}
 */
const useUnActivated = (callback: () => void) => {
  const { active } = useKeepAliveContext();

  useEffect(() => {
    if (!active) return;
    return () => {
      callback?.();
    };
  }, [active]);
};
export default useUnActivated;
