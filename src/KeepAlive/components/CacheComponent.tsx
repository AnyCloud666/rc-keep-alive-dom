import React, { Fragment, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  KEEP_ALIVE_CONTAINER_CHILD_ID,
  KEEP_ALIVE_CONTAINER_CHILD_KEY,
} from '../const';
import { RCKeepAlive } from '../typing';

function findNodes(container: HTMLDivElement | null, dataValue: string) {
  const nodes =
    container?.querySelectorAll(`[${KEEP_ALIVE_CONTAINER_CHILD_KEY}]`) ?? [];

  return (
    Array.from(nodes).filter(
      (node) => node.getAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY) === dataValue,
    ) ?? []
  );
}

function removeNodes(nodes: Element[]) {
  nodes?.forEach((node) => {
    node?.remove();
  });
}

const CacheComponent = memo(
  (props: RCKeepAlive.CacheComponentProps) => {
    const { cache, name, active, renderDiv, children, destroy } = props;

    // 渲染的目标元素
    const [targetElement] = useState(() => {
      const container = document.createElement('div');
      container.setAttribute('id', KEEP_ALIVE_CONTAINER_CHILD_ID);
      container.setAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY, name);
      container.className = `cache-component ${name} ${
        cache ? 'cache' : 'no-cache'
      }`;
      return container;
    });

    /** 是否激活 */
    const activatedRef = useRef(false);

    activatedRef.current = activatedRef.current || active;

    // 改用 useEffect
    // useLayoutEffect 渲染时机比 useEffect 更早，但是会阻塞渲染，导致闪烁

    useEffect(() => {
      if (active) {
        renderDiv.current?.appendChild?.(targetElement);
      } else {
        const activeNodes = findNodes(renderDiv.current, name);

        removeNodes(activeNodes);

        if (!cache) {
          destroy?.(name);
        }
      }
    }, [active, renderDiv, targetElement, children]);

    return (
      <Fragment>
        {activatedRef.current && createPortal(children, targetElement)}
      </Fragment>
    );
  },
  (pre, next) => {
    // true 跳过渲染
    return (
      pre.cache === next.cache &&
      pre.name === next.name &&
      pre.active === next.active &&
      pre.children === next.children
    );
  },
);

export default CacheComponent;
