import { ReactElement, ReactNode, RefObject } from 'react';

declare namespace RCKeepAlive {
  type ComponentReactElement = {
    children: ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    > | null;
  };

  type CacheComponentProps = ComponentReactElement & {
    /** 是否激活 */
    active: boolean;
    /** 路由地址 路由名称 */
    cacheKey: string;
    /** 路由渲染位置 */
    renderDiv: RefObject<HTMLDivElement>;
    wrapperChildrenId?: string;
    wrapperChildrenClassName?: string;
    /** 缓存的路由名称 | 路径 */
    include?: Array<string | RegExp> | string | RegExp;
    /** 排除缓存的路由名称 | 路径 */
    exclude?: Array<string | RegExp> | string | RegExp;
    /**
     * 过渡切换
     * 自定义过渡切换
     * or
     * window.startViewTransition
     * or
     * 不适用过渡切换
     *
     * viewTransition
     *
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Document/startViewTransition
     * @see https://caniuse.com/?search=startViewTransition
     *
     */
    transition?: 'customer' | 'viewTransition' | false;
    /** 过渡切换的持续时间 自定义模式下生效 */
    duration?: number;

    activeClassName?: string;
    inactiveClassName?: string;
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

  type KeepAliveProps = ComponentReactElement & {
    /** 当前活动的路由名称 | 路径 */
    activeName: string;
    /** 缓存的路由名称 | 路径 */
    include?: Array<string | RegExp> | string | RegExp;
    /** 排除缓存的路由名称 | 路径 */
    exclude?: Array<string | RegExp> | string | RegExp;
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
    wrapperId?: string;
    wrapperClassName?: string;
    wrapperChildrenId?: string;
    wrapperChildrenClassName?: string;
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
     * 过渡切换的持续时间 自定义模式下生效
     * 单位: ms
     */
    duration?: number;
    /** 自定义过渡动画时，可传入该项 默认为 active  */
    activeClassName?: string;
    /** 自定义过渡动画时，可传入该项 默认为 inactive */
    inactiveClassName?: string;
  };

  type CacheNode = {
    name: string;
    ele: ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    > | null;
    lastActiveTime: number;
  };

  type KeepAliveProviderProps = {
    children?: ReactNode;
    active?: boolean;
  } & KeepAliveRef;

  type KeepAliveContextProps = {
    active?: boolean;
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
}
