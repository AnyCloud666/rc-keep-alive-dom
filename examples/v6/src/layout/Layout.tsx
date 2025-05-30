import { NavLink, useLocation, useOutlet } from 'react-router-dom';

import { KeepAlive } from '../../../../src/KeepAlive';

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
      <KeepAlive activeName={activeName}>
        {outlet}
        {/* <Outlet /> */}
      </KeepAlive>
    </div>
  );
};

export default Layout;
