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
    name: string;
    /** 路由渲染位置 */
    renderDiv: RefObject<HTMLDivElement>;
    /** 是否缓存 */
    cache?: boolean;
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
    include?: Array<string>;
    /** 排除缓存的路由名称 | 路径 */
    exclude?: Array<string>;
    /** 缓存最大数量 */
    maxLen?: number;
    /** 是否缓存 */
    cache?: boolean;
    /** 缓存引用 */
    aliveRef?: RefObject<KeepAliveRef>;
  };

  type CacheNode = {
    name: string;
    ele: ReactElement<
      unknown,
      string | React.JSXElementConstructor<any>
    > | null;
    cache: boolean;
  };

  type KeepAliveProviderProps = {
    children?: ReactNode;
    initialActiveName?: string;
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
