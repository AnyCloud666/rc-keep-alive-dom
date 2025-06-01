import { NavLink, useLocation, useOutlet } from 'react-router-dom';

import { MemoizedKeepAlive } from '../../../../src/KeepAlive';

const Layout = () => {
  const location = useLocation();
  const activeName = location.pathname + location.search;

  const outlet = useOutlet();

  return (
    <div>
      <NavLink to={'/page1'}>page1</NavLink>
      ++++++++++++++
      <NavLink to={'/page2'}>page2</NavLink>
      ++++++++++++++
      <NavLink to={'/page3'}>page3</NavLink>
      <br />
      {/* <KeepAlive activeCacheKey={activeName}>{outlet}</KeepAlive> */}
      <MemoizedKeepAlive
        transition={'customer'}
        activeName={activeName}
        // include={['/layout/page1']}
        cacheMaxTime={{
          '/page3': 10 * 1000,
        }}
        duration={500}
        wrapperChildrenStyle={{
          height: '50vh',
          overflow: 'auto',
        }}
      >
        {outlet}
      </MemoizedKeepAlive>
    </div>
  );
};

export default Layout;
