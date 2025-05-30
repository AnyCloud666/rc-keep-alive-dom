/* eslint-disable no-param-reassign */
import React, {
  Fragment,
  memo,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import KeepAliveProvider from '../Provider/KeepAliveProvider';
import { KEEP_ALIVE_CONTAINER_ID } from '../const';
import type { RCKeepAlive } from '../typing';
import { isNil } from '../utils';
import CacheComponent from './CacheComponent';

const KeepAlive = memo((props: RCKeepAlive.KeepAliveProps) => {
  const {
    activeName,
    cache,
    children,
    exclude,
    include,
    maxLen = 20,
    aliveRef,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [cacheReactNodes, setCacheReactNodes] = useState<
    RCKeepAlive.CacheNode[]
  >([]);

  const refresh = useCallback(
    (cacheActiveName?: string) => {
      setCacheReactNodes((cacheNodes) => {
        const name = cacheActiveName || activeName;
        return cacheNodes.map((item) => {
          if (item.name === name) {
            return {
              ...item,
            };
          }
          return item;
        });
      });
    },
    [activeName, children],
  );

  const destroy = useCallback(
    (cacheActiveName?: string | string[]) => {
      const names = cacheActiveName || activeName;

      const cacheNames = Array.isArray(names) ? names : [names];

      setCacheReactNodes((cacheNodes) => {
        return cacheNodes.filter(({ name }) => !cacheNames.includes(name));
      });
    },
    [activeName],
  );

  const destroyAll = useCallback(() => {
    setCacheReactNodes([]);
  }, []);

  const destroyOthers = useCallback(() => {
    setCacheReactNodes((cacheReactNodes) => {
      return cacheReactNodes.filter(({ name }) => name === activeName);
    });
  }, [activeName]);

  const getCacheNodes = useCallback(() => {
    return cacheReactNodes;
  }, [cacheReactNodes]);

  useImperativeHandle(
    aliveRef,
    () => ({
      refresh,
      destroy,
      destroyAll,
      destroyOthers,
      getCacheNodes,
    }),
    [cacheReactNodes, setCacheReactNodes, activeName],
  );

  useLayoutEffect(() => {
    if (isNil(activeName)) {
      return;
    }
    setCacheReactNodes((cacheReactNodes) => {
      if (cacheReactNodes.length >= maxLen) {
        cacheReactNodes = cacheReactNodes.slice(1, cacheReactNodes.length);
      }
      // remove exclude
      if (exclude && exclude.length > 0) {
        cacheReactNodes = cacheReactNodes.filter(
          ({ name }) => !exclude?.includes(name),
        );
      }
      // only keep include
      if (include && include.length > 0) {
        cacheReactNodes = cacheReactNodes.filter(({ name }) =>
          include?.includes(name),
        );
      }
      // remove cache false
      cacheReactNodes = cacheReactNodes.filter(({ cache }) => cache);
      const cacheReactNode = cacheReactNodes.find(
        (res) => res.name === activeName,
      );
      if (isNil(cacheReactNode)) {
        cacheReactNodes.push({
          cache: cache ?? true,
          name: activeName,
          ele: children,
        });
      } else {
        // important update children when activeName is same
        // this can trigger children onActive
        cacheReactNodes = cacheReactNodes.map((res) => {
          return res.name === activeName ? { ...res, ele: children } : res;
        });
      }
      return cacheReactNodes;
    });
  }, [children, cache, activeName, exclude, maxLen, include]);

  return (
    <Fragment>
      <div
        ref={containerRef}
        id={KEEP_ALIVE_CONTAINER_ID}
        className={KEEP_ALIVE_CONTAINER_ID}
      ></div>

      {cacheReactNodes?.map(({ name, cache, ele }) => (
        <KeepAliveProvider
          initialActiveName={activeName}
          key={name}
          active={name === activeName}
          refresh={refresh}
          destroy={destroy}
          destroyAll={destroyAll}
          destroyOthers={destroyOthers}
          getCacheNodes={getCacheNodes}
        >
          <CacheComponent
            active={name === activeName}
            renderDiv={containerRef}
            cache={cache}
            name={name}
            refresh={refresh}
            destroy={destroy}
            destroyAll={destroyAll}
            destroyOthers={destroyOthers}
            getCacheNodes={getCacheNodes}
          >
            {ele}
          </CacheComponent>
        </KeepAliveProvider>
      ))}
    </Fragment>
  );
});

export default KeepAlive;
