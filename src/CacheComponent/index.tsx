import React, { Fragment, memo, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  KEEP_ALIVE_CONTAINER_CHILD_ID,
  KEEP_ALIVE_CONTAINER_CHILD_KEY,
  KEEP_ALIVE_REFRESH_COUNT,
  KEEP_ENTER_ACTIVE_CLASS_NAME,
  KEEP_ENTER_FROM_CLASS_NAME,
  KEEP_LEAVE_ACTIVE_CLASS_NAME,
  KEEP_LEAVE_TO_CLASS_NAME,
} from '../const';
import { RCKeepAlive } from '../typing';
import { delayAsync, isInclude } from '../utils';

/**
 * 隐藏节点
 *
 * @param {Element[]} nodes 节点列表
 * @param {string} cacheClassName 将列表中存在该类名的节点移除
 */
function hiddenNodes(
  nodes: Element[],
  cacheClassName: string,
  iframeClassName: string,
) {
  nodes?.forEach((node) => {
    if (node.classList.contains(cacheClassName)) {
      if (node.classList.contains(iframeClassName)) {
        (node as HTMLIFrameElement).style.display = 'none';
      } else {
        node?.remove();
      }
    }
  });
}

/**
 * 显示节点
 *
 * @param container
 * @param node
 * @param enterActiveClassName
 * @param enterFromClassName
 * @param duration
 * @param isCustomer
 * @returns
 */
async function showNodes(
  container: HTMLDivElement | null,
  node: Element,
  enterActiveClassName: string,
  enterFromClassName: string,
  duration: number,
  isCustomer?: boolean,
  isIframe?: boolean,
) {
  if (!container) return;

  if (isIframe) {
    if (container.contains(node)) {
      (node as HTMLIFrameElement).style.display = 'block';
    } else {
      container.appendChild(node);
    }
  } else {
    container.appendChild(node);
  }

  if (!isCustomer) return;

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
  isCustomer?: boolean,
) {
  const nodes = getChildNodes(container);

  const activeNodes = nodes.filter(
    (node) =>
      node.getAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY) &&
      (node as HTMLDivElement)?.style?.display !== 'none',
  );
  if (isCustomer) {
    activeNodes?.forEach(async (node) => {
      node?.classList.remove(leaveActiveClassName, leaveToClassName);
      node?.classList.add(leaveActiveClassName);
      await delayAsync(16);
      node?.classList.add(leaveToClassName);
      await delayAsync(duration);
      node?.classList.remove(leaveActiveClassName, leaveToClassName);
    });
  }

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

function isDisabledTransition(
  activeName: string,
  disabledTransition?: Array<string | RegExp> | string | RegExp,
) {
  if (disabledTransition) {
    return isInclude(disabledTransition, activeName);
  }
  return false;
}

function isIframe(
  activeName: string,
  exclude?: Array<string | RegExp> | string | RegExp,
  includeIframe?: Array<string | RegExp> | string | RegExp,
) {
  if (exclude) {
    return !isInclude(exclude, activeName);
  }
  if (includeIframe) {
    return isInclude(includeIframe, activeName);
  }
  return false;
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
      wrapperChildrenClassName = KEEP_ALIVE_CONTAINER_CHILD_ID,
      enterFromClassName = KEEP_ENTER_FROM_CLASS_NAME,
      enterActiveClassName = KEEP_ENTER_ACTIVE_CLASS_NAME,
      leaveToClassName = KEEP_LEAVE_TO_CLASS_NAME,
      leaveActiveClassName = KEEP_LEAVE_ACTIVE_CLASS_NAME,
      scrollTop,
      scrollLeft,
      recordScrollPosition,
      onSaveScrollPosition,
      disableTransitions,
      onTransition,
      includeIframe,
      iframeClassName,
      refreshCount,
    } = props;

    // 渲染的目标元素
    const targetElement = useMemo(() => {
      const container = document.createElement('div');
      const iframe = isIframe(activeName, exclude, includeIframe);
      // container.setAttribute('id', wrapperChildrenId);
      container.setAttribute(KEEP_ALIVE_CONTAINER_CHILD_KEY, activeName);
      container.setAttribute(KEEP_ALIVE_REFRESH_COUNT, refreshCount.toString());
      container.className = `${wrapperChildrenClassName} ${activeName} ${
        iframe ? iframeClassName : ''
      }`;
      // 遍历样式对象并应用样式
      for (const [key, value] of Object.entries(wrapperChildrenStyle)) {
        container.style[key as RCKeepAlive.StyleKeys] = value;
      }
      return container;
    }, [refreshCount, iframeClassName, wrapperChildrenClassName, activeName]);

    /** 是否激活 */
    const activatedRef = useRef(false);

    /**
     * 激活状态
     * 1. 第一次渲染激活 其他情况下不改变
     */
    activatedRef.current = activatedRef.current || active;

    useEffect(() => {
      const cached = isCached(activeName, exclude, include);
      const disabled = isDisabledTransition(activeName, disableTransitions);
      const iframe = isIframe(activeName, exclude, includeIframe);
      const renderDivCurrent = renderDiv.current;
      if (!renderDivCurrent) return;

      if (active) {
        const change = async (isCustomer?: boolean) => {
          if (isCustomer) {
            onTransition?.({
              name: activeName,
              type: 'start',
              time: Date.now(),
            });
          }
          const activeNodes = switchActiveNodeToInactive(
            renderDivCurrent,
            activeName,
            leaveActiveClassName,
            leaveToClassName,
            duration,
            isCustomer,
          );
          // 延迟移除节点
          if (isCustomer && !disabled) {
            await delayAsync(duration);
          }
          hiddenNodes(activeNodes, wrapperChildrenClassName, iframeClassName!);
          if (renderDiv.current?.contains(targetElement) && !iframe) {
            return;
          }
          if (isCustomer && !disabled) {
            await delayAsync(16);
          }
          showNodes(
            renderDiv.current,
            targetElement,
            enterActiveClassName,
            enterFromClassName,
            duration,
            isCustomer,
            iframe,
          );

          if (isCustomer) {
            onTransition?.({
              name: activeName,
              type: 'end',
              time: Date.now(),
            });
          }
          if (recordScrollPosition) {
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
        if (!cached || disabled) {
          destroy?.(activeName);
        }
        if (cached && recordScrollPosition) {
          onSaveScrollPosition({
            name: activeName,
            scrollLeft: targetElement.scrollLeft ?? 0,
            scrollTop: targetElement.scrollTop ?? 0,
          });
        }
      }
    }, [active, renderDiv, activeName, exclude, include, refreshCount]);

    return (
      <Fragment>
        {activatedRef.current
          ? createPortal(children, targetElement, activeName)
          : null}
      </Fragment>
    );
  },
  (pre, next) => {
    // true 跳过渲染
    return (
      pre.active === next.active &&
      pre.children === next.children &&
      pre.exclude === next.exclude &&
      pre.include === next.include &&
      pre.refreshCount === next.refreshCount
    );
  },
);

export default CacheComponent;
