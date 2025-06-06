import { NavLink } from 'react-router-dom';

import { useRef } from 'react';
// import { KeepAliveOutlet } from 'rc-keep-alive-dom';

import { KeepAliveOutlet } from '../../../../src';
import type { RCKeepAlive } from '../../../../src/typing';

const Layout = () => {
  const aliveRef = useRef<RCKeepAlive.KeepAliveRef>(null);
  return (
    <div>
      <NavLink to={'/page1'}>page1</NavLink>
      ++++++++++++++
      <NavLink to={'/page2'}>page2</NavLink>
      ++++++++++++++
      <NavLink to={'/page3'}>page3</NavLink>
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          aliveRef.current?.destroy('/page1');
        }}
        type="submit"
      >
        移除 page1 缓存
      </button>
      <button
        onClick={() => {
          aliveRef.current?.refresh('/page1');
        }}
        type="submit"
      >
        刷新 page1 缓存
      </button>
      <button
        onClick={() => {
          aliveRef.current?.destroy('/page2');
        }}
        type="submit"
      >
        移除 page2 缓存
      </button>
      <button
        onClick={() => {
          aliveRef.current?.refresh('/page2');
        }}
        type="submit"
      >
        刷新 page2 缓存
      </button>
      <KeepAliveOutlet
        transition={'customer'}
        cacheMaxTime={{
          '/page3': 10 * 1000,
        }}
        duration={500}
        wrapperChildrenStyle={{
          height: '80vh',
          overflow: 'auto',
        }}
        recordScrollPosition={true}
        disableTransitions={['/']}
        includeIframe={['/page2']}
        // 当 exclude 和 includeIframe 同时存在时，exclude 优先级更高
        // exclude={['/page2']}
        aliveRef={aliveRef}
      />
    </div>
  );
};

export default Layout;
