import { NavLink } from 'react-router-dom';

import { KeepAliveOutlet } from '../../../../src';
// import { KeepAliveOutlet } from 'rc-keep-alive-dom';

const Layout = () => {
  return (
    <div>
      <NavLink to={'/page1'}>page1</NavLink>
      ++++++++++++++
      <NavLink to={'/page2'}>page2</NavLink>
      ++++++++++++++
      <NavLink to={'/page3'}>page3</NavLink>
      <br />
      <KeepAliveOutlet
        transition={'customer'}
        cacheMaxTime={{
          '/page3': 10 * 1000,
        }}
        duration={500}
        wrapperChildrenStyle={{
          height: '50vh',
          overflow: 'auto',
        }}
        recordScrollPosition={true}
        disableTransitions={['/']}
      />
    </div>
  );
};

export default Layout;
