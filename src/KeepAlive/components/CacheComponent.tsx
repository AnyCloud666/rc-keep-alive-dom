import React, { Fragment, memo, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  KEEP_ALIVE_CONTAINER_CHILD_ID,
  KEEP_ALIVE_CONTAINER_CHILD_KEY,
  KEEP_ENTER_ACTIVE_CLASS_NAME,
  KEEP_ENTER_FROM_CLASS_NAME,
  KEEP_LEAVE_ACTIVE_CLASS_NAME,
  KEEP_LEAVE_TO_CLASS_NAME,
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

async function renderCacheNodes(
  container: HTMLDivElement | null,
  node: Element,
  enterActiveClassName: string,
  enterFromClassName: string,
  duration: number,
) {
  if (!container) return;
  container.appendChild(node);
  node.classList.remove(enterFromClassName, enterActiveClassName);
  // 渲染阶段初始样式
  node.classList.add(enterFromClassName);
  // 增加过渡样式
  await delayAsync(16);
  node.classList.add(enterActiveClassName);
  // 移除过渡样式
  await delayAsync(duration);
  node.classList.remove(enterFromClassName, enterActiveClassName);
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
 * @param {string} leaveActiveClassName
 * @return {*}
 */
function switchActiveNodeToInactive(
  container: HTMLDivElement,
  cacheActiveName: string,
  leaveActiveClassName: string,
  leaveToClassName: string,
  duration: number,
) {
  const nodes = getChildNodes(container);

  const activeNodes = nodes.filter(
    (node) =>
      node.getAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY) !== cacheActiveName,
  );

  activeNodes?.forEach(async (node) => {
    node?.classList.remove(leaveActiveClassName, leaveToClassName);
    node?.classList.add(leaveActiveClassName);
    await delayAsync(16);
    node?.classList.add(leaveToClassName);
    await delayAsync(duration);
    node?.classList.remove(leaveActiveClassName, leaveToClassName);
  });

  return activeNodes;
}

function isCached(
  activeName: string,
  exclude?: Array<string | RegExp> | string | RegExp,
  include?: Array<string | RegExp> | string | RegExp,
) {
  if (include) {
    return isInclude(include, activeName);
  } else {
    if (exclude) {
      return !isInclude(exclude, activeName);
    }
    return true;
  }
}

const CacheComponent = memo(
  (props: RCKeepAlive.CacheComponentProps) => {
    const {
      activeName,
      active,
      renderDiv,
      children,
      transition,
      duration = 300,
      destroy,
      exclude,
      include,
      wrapperChildrenStyle = { height: '100%' },
      wrapperChildrenId = KEEP_ALIVE_CONTAINER_CHILD_ID,
      wrapperChildrenClassName = KEEP_ALIVE_CONTAINER_CHILD_ID,
      enterFromClassName = KEEP_ENTER_FROM_CLASS_NAME,
      enterActiveClassName = KEEP_ENTER_ACTIVE_CLASS_NAME,
      leaveToClassName = KEEP_LEAVE_TO_CLASS_NAME,
      leaveActiveClassName = KEEP_LEAVE_ACTIVE_CLASS_NAME,
      scrollTop,
      scrollLeft,
      recordScrollPosition,
      onSaveScrollPosition,
    } = props;

    // 渲染的目标元素
    const targetElement = useMemo(() => {
      const container = document.createElement('div');
      container.setAttribute('id', wrapperChildrenId);
      container.setAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY, activeName);
      container.className = `${wrapperChildrenClassName} ${activeName}`;
      // 遍历样式对象并应用样式
      for (const [key, value] of Object.entries(wrapperChildrenStyle)) {
        container.style[key as RCKeepAlive.StyleKeys] = value;
      }
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
      const cached = isCached(activeName, exclude, include);
      const renderDivCurrent = renderDiv.current;
      if (!renderDivCurrent) return;

      if (active) {
        const change = async (isCustomer?: boolean) => {
          const activeNodes = switchActiveNodeToInactive(
            renderDivCurrent,
            activeName,
            leaveActiveClassName,
            leaveToClassName,
            duration,
          );

          // 延迟移除节点
          if (isCustomer) {
            await delayAsync(duration - 40);
          }
          removeNodes(activeNodes, wrapperChildrenClassName);
          if (renderDiv.current?.contains(targetElement)) {
            return;
          }

          // 延迟渲染节点
          if (isCustomer) {
            await delayAsync(duration - 40);
          }
          renderCacheNodes(
            renderDiv.current,
            targetElement,
            enterActiveClassName,
            enterFromClassName,
            duration,
          );
          if (recordScrollPosition) {
            await delayAsync(duration - 40);
            targetElement?.scrollTo({
              top: scrollTop,
              left: scrollLeft,
              behavior: 'smooth',
            });
          }
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
          destroy?.(activeName);
        }
        if (recordScrollPosition) {
          onSaveScrollPosition({
            name: activeName,
            scrollLeft: targetElement.scrollLeft ?? 0,
            scrollTop: targetElement.scrollTop ?? 0,
          });
        }
      }
    }, [active, renderDiv, activeName, exclude, include]);

    return (
      <Fragment>
        {activatedRef.current && createPortal(children, targetElement)}
      </Fragment>
    );
  },
  (pre, next) => {
    // true 跳过渲染
    return (
      pre.activeName === next.activeName &&
      pre.active === next.active &&
      pre.children === next.children &&
      pre.exclude === next.exclude &&
      pre.include === next.include &&
      pre.transition === next.transition &&
      pre.duration === next.duration &&
      pre.wrapperChildrenStyle === next.wrapperChildrenStyle &&
      pre.wrapperChildrenId === next.wrapperChildrenId &&
      pre.wrapperChildrenClassName === next.wrapperChildrenClassName &&
      pre.enterFromClassName === next.enterFromClassName &&
      pre.enterActiveClassName === next.enterActiveClassName &&
      pre.leaveToClassName === next.leaveToClassName &&
      pre.leaveActiveClassName === next.leaveActiveClassName &&
      pre.scrollTop === next.scrollTop &&
      pre.scrollLeft === next.scrollLeft &&
      pre.onSaveScrollPosition === next.onSaveScrollPosition
    );
  },
);

export default CacheComponent;
