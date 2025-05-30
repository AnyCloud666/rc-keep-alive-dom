import { useMemoizedFn, useSessionStorageState } from 'ahooks';
import React, { memo, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeepAliveManageContext } from '../Context/KeepAliveManageContext';
import { KEEP_PAGE_STORAGE_KEY } from '../const';
import { RCKeepAlive } from '../typing';

/**
 * 管理缓存页面的Provider
 * 需要在应用的入口处使用
 */
const KeepAliveManageProvider = memo(
  (props: RCKeepAlive.KeepAliveManageProviderProps) => {
    const { children } = props;
    const location = useLocation();
    const navigate = useNavigate();

    const fullPath = location.pathname + location.search;

    const [active, setActive] = useState(fullPath);
    const keepAliveRef = useRef<RCKeepAlive.KeepAliveRef>(null);

    const [pages = [], setPages] = useSessionStorageState<
      RCKeepAlive.PageConfig[]
    >(KEEP_PAGE_STORAGE_KEY, {
      defaultValue: [],
    });

    const lastOpenKey = useRef<string>('');

    const getKeepAliveRef = useMemoizedFn(() => {
      return keepAliveRef.current;
    });

    const navigateTo = useMemoizedFn((key: string) => {
      const pathname = key.indexOf('?') > -1 ? key.split('?')[0] : key;
      const search = key.indexOf('?') > -1 ? key.split('?')[1] : '';
      navigate({
        pathname,
        search,
      });
    });

    const close = useMemoizedFn((key: string, callback?: () => void) => {
      const index = pages.findIndex((item) => item.key === key);
      if (index === -1) return;
      const newPages = [...pages];
      if (newPages.length <= 1) {
        // message.warning('至少保留一个标签页');
        return null;
      }
      callback?.();

      keepAliveRef.current?.destroy(key);
      newPages.splice(index, 1);
      setPages(newPages);

      let nextActiveKey = '';
      if (active === key) {
        const lastKey = lastOpenKey.current;
        if (lastKey && newPages.some((item) => item.key === lastKey)) {
          nextActiveKey = lastKey;
        } else {
          nextActiveKey = newPages?.[index - 1]?.key;
        }
        setActive(nextActiveKey);
      }

      if (nextActiveKey) navigateTo(nextActiveKey);

      return nextActiveKey;
    });

    const open = useMemoizedFn(
      (page: RCKeepAlive.PageConfig, navigate?: boolean) => {
        if (!page || !page.key) {
          throw new Error('route info is not valid');
        }
        lastOpenKey.current = active;

        const existed = pages.some((item) => item.key === page.key);
        if (!existed) {
          setPages([...pages, page]);
        }

        if (page.key === active) return;

        setActive(page.key);

        if (navigate) navigateTo(page.key);
      },
    );

    const closeCurrent = useMemoizedFn((callback?: () => void) => {
      return close(active, callback);
    });

    const value = useMemo<RCKeepAlive.KeepAliveManageContextProps>(() => {
      return {
        active,
        pages,
        setActive,
        setPages,
        open,
        close,
        closeCurrent,
        getKeepAliveRef,
      };
    }, []);

    return (
      <KeepAliveManageContext.Provider value={value}>
        {children}
      </KeepAliveManageContext.Provider>
    );
  },
);

export default KeepAliveManageProvider;
