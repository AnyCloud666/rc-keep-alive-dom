import { CSSProperties, ReactElement, ReactNode, RefObject } from 'react';

declare namespace RCKeepAlive {
  type ComponentReactElement = {
    children: ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    > | null;
  };

  type CacheComponentBase = {
    /** 当前活动的路由名称 */
    activeName: string;
    /** 缓存的路由名称 | 路径 */
    include?: Array<string | RegExp> | string | RegExp;
    /** 排除缓存的路由名称 | 路径 */
    exclude?: Array<string | RegExp> | string | RegExp;
    /**
     * 子节点id 默认 keep-alive-container-child
     *
     * 0.0.5 版本之后不在支持该属性
     *
     * @deprecated
     */
    wrapperChildrenId?: string;
    /** 子节点类名 默认 keep-alive-container-child */
    wrapperChildrenClassName?: string;
    /** 子节点样式 默认 { height: '100%' } */
    wrapperChildrenStyle?: CSSProperties;
    /**
     * 过渡切换
     * 自定义过渡切换
     * or
     * window.startViewTransition
     * or
     * 不适用过渡切换
     */
    transition?: 'customer' | 'viewTransition';
    /**
     * 过渡切换的持续时间 customer 模式下生效
     * 和 transition 过渡时间保持一致
     * 单位: ms
     */
    duration?: number;
    /** 进入初始状态 动画类名 默认 keep-enter-form */
    enterFromClassName?: string;
    /** 进入动画结束 动画类名 默认 keep-enter-active*/
    enterActiveClassName?: string;
    /** 离开初始状态 动画类名 默认 keep-leave-active */
    leaveActiveClassName?: string;
    /** 离开动画结束 动画类名 默认 keep-leave-to */
    leaveToClassName?: string;
    /** 记录缓存节点的滚动位置 */
    recordScrollPosition?: boolean;
    /**
     * 禁止使用过渡动画的 activeName
     * \<Outlet \/\> 所在的组件禁止触发过渡动画
     * 原因，初始渲染重定向时无法判断动画执行完成时间
     * 为什么不用 exclude 进行排除，exclude 作用只是排除不缓存的路由或组件
     */
    disableTransitions?: Array<string | RegExp> | string | RegExp;
    /**
     * 需要缓存 iframe 的路由名称 | 路径
     */
    includeIframe?: Array<string | RegExp> | string | RegExp;
    /** 当includeIframe 存在时，会给子容器节点加上该类名 */
    iframeClassName?: string;
  };

  type TransitionActive = {
    /** 当前执行过渡的 路由 | 组件名称 */
    name: string;
    /** 过渡类型 start | end */
    type: 'start' | 'end';
    /**
     * 过渡开始时间
     * 单位: ms
     */
    time: number;
  };

  type CacheComponentProps = ComponentReactElement &
    CacheComponentBase & {
      /** 是否激活 */
      active: boolean;
      /** 路由渲染位置 */
      renderDiv: RefObject<HTMLDivElement>;
      /** 滚动距离顶部位置 */
      scrollTop: number;
      /** 滚动距离左侧位置 */
      scrollLeft: number;
      onSaveScrollPosition: (nodeInfo: RCKeepAlive.NodePosition) => void;
      /** 开始过渡动画 */
      onTransition: (t: TransitionActive) => void;
      lastActiveTime?: number;
      refreshCount: number;
    } & KeepAliveRef;

  type KeepAliveRef = {
    /** 刷新缓存 */
    refresh: (cacheActiveName?: string) => void;
    /** 销毁缓存 */
    destroy: (cacheActiveName?: string) => void;
    /** 销毁所有缓存 */
    destroyAll: () => void;
    /** 销毁除当前之外的所有缓存 */
    destroyOthers: (cacheActiveName?: string) => void;
    /** 获取缓存节点 */
    getCacheNodes: () => CacheNode[];
  };

  type KeepAliveProps = ComponentReactElement &
    CacheComponentBase & {
      /** 缓存最大数量 */
      cacheMaxSize?: number;
      /**
       * 缓存时间
       * 没有缓存时间默认一直缓存
       * 单位: ms
       */
      cacheMaxTime?: number | Record<string, number>;
      /** 缓存引用 */
      aliveRef?: RefObject<KeepAliveRef>;
      /** 渲染容器节点id */
      wrapperId?: string;
      /** 渲染容器节点类名 */
      wrapperClassName?: string;
      /** 渲染容器节点样式 */
      wrapperStyle?: CSSProperties;
    };

  type NodePosition = {
    name: string;
    /** 滚动距离顶部位置 */
    scrollTop: number;
    /** 滚动距离左侧位置 */
    scrollLeft: number;
  };

  type CacheNode = NodePosition & {
    ele: ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    > | null;
    refreshCount: number;
    lastActiveTime: number;
  };

  type KeepAliveProviderProps = {
    children?: ReactNode;
    active?: boolean;
    transition?: 'customer' | 'viewTransition';
    transitionActive?: TransitionActive;
  } & KeepAliveRef;

  type KeepAliveContextProps = {
    active?: boolean;
    transition?: 'customer' | 'viewTransition';
    transitionActive?: TransitionActive;
  } & KeepAliveRef;

  type PageConfig = {
    label: string; // 路由的名称
    // 路由的 path
    key: string;
    // 滚动位置
    scrollPosition?: number;
  };

  type KeepAliveManageContextProps = {
    active?: string;
    pages?: PageConfig[];
    setPages?: (pages: PageConfig[]) => void;
    open?: (page: PageConfig, navigate?: boolean) => void;
    close?: (name: string, callback?: () => void) => string | null | undefined;
    closeCurrent?: (callback?: () => void) => string | null | undefined;
    getKeepAliveRef?: () => RCKeepAlive.KeepAliveRef | null;
    navigateTo?: (name: string) => void;
  };

  type KeepAliveManageProviderProps = {
    children?: ReactNode | ReactNode[];
  };

  type StyleKeys = Exclude<keyof CSSStyleDeclaration, 'length' | 'parentRule'>;

  type KeepAliveOutletProps = Omit<KeepAliveProps, 'children' | 'activeName'>;

  type TransitionOption = {
    onlyEmitOnce?: boolean;
  };
}
