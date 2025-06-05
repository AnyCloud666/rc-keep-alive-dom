import { useEffect, useRef } from 'react';
import { RCKeepAlive } from '../typing';
import { useKeepAliveContext } from './useKeepAliveContext';

const useTransition = (
  callback: (params?: RCKeepAlive.TransitionActive) => void,
  option?: RCKeepAlive.TransitionOption,
) => {
  const isEmit = useRef(0);
  const { active, transition, transitionActive } = useKeepAliveContext();

  useEffect(() => {
    if (transition === 'customer' && active) {
      if (option?.onlyEmitOnce && isEmit.current < 2) {
        isEmit.current = isEmit.current + 1;
        callback(transitionActive);
      }

      if (!option?.onlyEmitOnce) {
        callback(transitionActive);
      }
    }
  }, [transition, transitionActive, option]);
};

export default useTransition;
