# 快速开始

## 安装

```bash

# use pnpm to install
pnpm add rc-keep-alive-dom

# use npm to install
npm install rc-keep-alive-dom

# use yarn to install
yarn add rc-keep-alive-dom

```

## 使用

```js
import { NavLink } from 'react-router-dom';

import { KeepAliveOutlet } from 'rc-keep-alive-dom';

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
      />
    </div>
  );
};

export default Layout;
```
