import React, { Fragment, memo, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  KEEP_ACTIVE_CLASS_NAME,
  KEEP_ALIVE_CONTAINER_CHILD_ID,
  KEEP_ALIVE_CONTAINER_CHILD_KEY,
  KEEP_INACTIVE_CLASS_NAME,
} from '../const';
import { RCKeepAlive } from '../typing';
import { delayAsync, isInclude } from '../utils';

/**
 * 移除节点
 *
 * @param {Element[]} nodes 节点列表
 * @param {string} cacheClassName 将列表中存在该类名的节点移除
 */
function removeNodes(nodes: Element[], cacheClassName: string) {
  nodes?.forEach((node) => {
    if (node.classList.contains(cacheClassName)) {
      node?.remove();
    }
  });
}

/**
 * 转换节点列表转换为数组
 *
 * @param {HTMLDivElement} [dom]
 * @return {*}
 */
function getChildNodes(dom?: HTMLDivElement) {
  return dom ? Array.from(dom.children) : [];
}

/**
 * 切换节点状态
 *
 * @param {HTMLDivElement} container
 * @param {string} cacheActiveName
 * @param {string} activeClassName
 * @param {string} inactiveClassName
 * @return {*}
 */
function switchActiveNodeToInactive(
  container: HTMLDivElement,
  cacheActiveName: string,
  activeClassName: string,
  inactiveClassName: string,
) {
  const nodes = getChildNodes(container);

  const activeNodes = nodes.filter(
    (node) =>
      node.getAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY) !== cacheActiveName,
  );

  activeNodes.forEach((node) => {
    node.classList.remove(activeClassName);
    node.classList.add(inactiveClassName);
  });

  return activeNodes;
}

function isCached(
  cacheKey: string,
  exclude?: Array<string | RegExp> | string | RegExp,
  include?: Array<string | RegExp> | string | RegExp,
) {
  if (include) {
    return isInclude(include, cacheKey);
  } else {
    if (exclude) {
      return !isInclude(exclude, cacheKey);
    }
    return true;
  }
}

const CacheComponent = memo(
  (props: RCKeepAlive.CacheComponentProps) => {
    const {
      cacheKey,
      active,
      renderDiv,
      children,
      transition,
      duration = 300,
      destroy,
      exclude,
      include,
      activeClassName = KEEP_ACTIVE_CLASS_NAME,
      inactiveClassName = KEEP_INACTIVE_CLASS_NAME,
      wrapperChildrenId = KEEP_ALIVE_CONTAINER_CHILD_ID,
      wrapperChildrenClassName = KEEP_ALIVE_CONTAINER_CHILD_ID,
    } = props;

    // 渲染的目标元素
    const targetElement = useMemo(() => {
      const container = document.createElement('div');
      container.setAttribute('id', wrapperChildrenId);
      container.setAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY, cacheKey);
      container.className = `${wrapperChildrenClassName} ${cacheKey} `;
      return container;
    }, []);

    /** 是否激活 */
    const activatedRef = useRef(false);

    /**
     * 激活状态
     * 1. 第一次渲染激活 其他情况下不改变
     */
    activatedRef.current = activatedRef.current || active;

    useEffect(() => {
      const cached = isCached(cacheKey, exclude, include);
      const renderDivCurrent = renderDiv.current;
      if (!renderDivCurrent) return;

      if (active) {
        const change = async (isCustomer?: boolean) => {
          const activeNodes = switchActiveNodeToInactive(
            renderDivCurrent,
            cacheKey,
            activeClassName,
            inactiveClassName,
          );

          if (isCustomer) {
            await delayAsync(duration - 40);
          }

          removeNodes(activeNodes, wrapperChildrenClassName);
          if (renderDiv.current?.contains(targetElement)) {
            return;
          }
          renderDiv.current?.appendChild?.(targetElement);
        };
        if (transition === 'viewTransition') {
          if (
            document.startViewTransition &&
            typeof document.startViewTransition === 'function'
          ) {
            document.startViewTransition(change);
          } else {
            change();
          }
        } else if (transition === 'customer') {
          change(true);
        } else {
          change();
        }
      } else {
        if (!cached) {
          destroy?.(cacheKey);
        }
      }
    }, [active, renderDiv, cacheKey, exclude, include]);

    return (
      <Fragment>
        {activatedRef.current && createPortal(children, targetElement)}
      </Fragment>
    );
  },
  (pre, next) => {
    // true 跳过渲染
    return (
      pre.cacheKey === next.cacheKey &&
      pre.active === next.active &&
      pre.children === next.children
    );
  },
);

export default CacheComponent;
