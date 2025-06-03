/* eslint-disable no-param-reassign */
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import CacheComponent from '../CacheComponent';
import KeepAliveProvider from '../Provider/KeepAliveProvider';
import {
  KEEP_ALIVE_CONTAINER_CHILD_ID,
  KEEP_ALIVE_CONTAINER_ID,
} from '../const';
import type { RCKeepAlive } from '../typing';
import { isNil, isNumber, isObject, safeStartTransition } from '../utils';

const KeepAlive = memo((props: RCKeepAlive.KeepAliveProps) => {
  const {
    activeName,
    children,
    exclude,
    include,
    cacheMaxSize = 20,
    cacheMaxTime,
    aliveRef,
    transition,
    duration,
    enterFromClassName,
    enterActiveClassName,
    leaveToClassName,
    leaveActiveClassName,
    wrapperId = KEEP_ALIVE_CONTAINER_ID,
    wrapperClassName = KEEP_ALIVE_CONTAINER_ID,
    wrapperStyle = { height: '100%' },
    wrapperChildrenClassName = KEEP_ALIVE_CONTAINER_CHILD_ID,
    wrapperChildrenId = KEEP_ALIVE_CONTAINER_CHILD_ID,
    wrapperChildrenStyle = { height: '100%' },
    recordScrollPosition,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const isDelay = useRef(false);

  const [cacheNodes, setCacheNodes] = useState<RCKeepAlive.CacheNode[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // 如果是自定义过渡，第一次渲染将不延迟删除dom
      if (transition === 'customer') {
        isDelay.current = true;
      }
    });
  }, []);

  const refresh = useCallback(
    (cacheActiveName?: string) => {
      setCacheNodes((cacheNodes) => {
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

      setCacheNodes((cacheNodes) => {
        return cacheNodes.filter(({ name }) => !cacheNames.includes(name));
      });
    },
    [activeName],
  );

  const destroyAll = useCallback(() => {
    setCacheNodes([]);
  }, []);

  const destroyOthers = useCallback(() => {
    setCacheNodes((cacheNodes) => {
      return cacheNodes.filter(({ name }) => name === activeName);
    });
  }, [activeName]);

  const getCacheNodes = useCallback(() => {
    return cacheNodes;
  }, [cacheNodes]);

  useImperativeHandle(
    aliveRef,
    () => ({
      refresh,
      destroy,
      destroyAll,
      destroyOthers,
      getCacheNodes,
    }),
    [cacheNodes, setCacheNodes, activeName],
  );

  /**
   * 核心部分
   * useOutlet,  setState , memo 配合进行dom缓存
   *
   * 不存在缓存节点时，新增缓存节点，并缓存dom
   * [...preCacheNode, {... }]
   *
   * 存在缓存节点时，更新缓存节点，不缓存dom , 此时memo 的作用进行浅对比，引用类型没有发生改变，不做更新，
   * {...} 结构之后，引用类型发生改变，进行更新 触发生命周期函数
   * preCacheNode.map((item) => {})
   *
   *
   */
  useLayoutEffect(() => {
    if (isNil(activeName)) {
      return;
    }

    safeStartTransition(() => {
      setCacheNodes((preCacheNode) => {
        const lastActiveTime = Date.now();
        // 超过最大的缓存 时间时，删除缓存节点
        const inLastActiveTimeCacheNodes = preCacheNode?.filter((item) => {
          if (isNumber(cacheMaxTime)) {
            return item.lastActiveTime + (cacheMaxTime || 0) > lastActiveTime;
          } else if (isObject(cacheMaxTime)) {
            if (item.name in cacheMaxTime) {
              return (
                item.lastActiveTime + (cacheMaxTime?.[item.name] || 0) >
                lastActiveTime
              );
            }
          }
          return true;
        });
        const cacheNode = inLastActiveTimeCacheNodes.find(
          (item) => item.name === activeName,
        );
        if (cacheNode) {
          return inLastActiveTimeCacheNodes.map((item) => {
            if (item.name === activeName) {
              // 当路由中存在 useActivated 时，将会触发该生命周期
              return {
                ...item,
                ele: children,
                lastActiveTime,
              };
            }
            return item;
          });
        } else {
          // 超过最大缓存数量时，删除最久未使用的缓存节点
          if (inLastActiveTimeCacheNodes.length > cacheMaxSize) {
            const node = inLastActiveTimeCacheNodes.reduce((pre, cur) => {
              return pre.lastActiveTime < cur.lastActiveTime ? pre : cur;
            });
            inLastActiveTimeCacheNodes.splice(
              inLastActiveTimeCacheNodes.indexOf(node),
              1,
            );
          }

          return [
            ...inLastActiveTimeCacheNodes,
            {
              scrollLeft: 0,
              scrollTop: 0,
              name: activeName,
              ele: children,
              lastActiveTime,
            },
          ];
        }
      });
    });
  }, [children, activeName, exclude, cacheMaxSize, include]);

  const onSaveScrollPosition = useCallback(
    ({ name, scrollTop, scrollLeft }: RCKeepAlive.NodePosition) => {
      setCacheNodes((preCacheNode) => {
        const index = preCacheNode.findIndex((item) => item.name === name);
        if (index === -1) return preCacheNode;
        preCacheNode[index].scrollLeft = scrollLeft;
        preCacheNode[index].scrollTop = scrollTop;
        return preCacheNode;
      });
    },
    [],
  );

  return (
    <Fragment>
      <div
        ref={containerRef}
        id={wrapperId}
        className={wrapperClassName}
        style={wrapperStyle}
      ></div>

      {cacheNodes?.map(({ name, ele, scrollTop, scrollLeft }) => (
        <KeepAliveProvider
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
            include={include}
            exclude={exclude}
            activeName={name}
            refresh={refresh}
            destroy={destroy}
            destroyAll={destroyAll}
            destroyOthers={destroyOthers}
            getCacheNodes={getCacheNodes}
            transition={transition}
            duration={duration}
            enterFromClassName={enterFromClassName}
            enterActiveClassName={enterActiveClassName}
            leaveActiveClassName={leaveActiveClassName}
            leaveToClassName={leaveToClassName}
            wrapperChildrenStyle={wrapperChildrenStyle}
            wrapperChildrenId={wrapperChildrenId}
            wrapperChildrenClassName={wrapperChildrenClassName}
            scrollTop={scrollTop}
            scrollLeft={scrollLeft}
            recordScrollPosition={recordScrollPosition}
            onSaveScrollPosition={onSaveScrollPosition}
            isDelay={isDelay.current}
          >
            {ele}
          </CacheComponent>
        </KeepAliveProvider>
      ))}
    </Fragment>
  );
});

export default KeepAlive;
