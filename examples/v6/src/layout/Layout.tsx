import { NavLink, useLocation, useOutlet } from 'react-router-dom';

import { MemoizedKeepAlive } from '../../../../src/KeepAlive';

const Layout = () => {
  const location = useLocation();
  const activeName = location.pathname + location.search;

  const outlet = useOutlet();

  return (
    <div>
      <NavLink to={'/layout/page1'}>page1</NavLink>
      ++++++++++++++
      <NavLink to={'/layout/page2'}>page2</NavLink>
      <br />
      {/* <KeepAlive activeCacheKey={activeName}>{outlet}</KeepAlive> */}
      <MemoizedKeepAlive
        transition={'viewTransition'}
        activeName={activeName}
        include={['/layout/page1']}
      >
        {outlet}
      </MemoizedKeepAlive>
    </div>
  );
};

export default Layout;
