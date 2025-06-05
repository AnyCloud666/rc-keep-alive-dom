# rc-keep-alive-dom

cache react router

## Usage

```bash
# use pnpm to install
pnpm add rc-keep-alive-dom

# use npm to install
npm install rc-keep-alive-dom

# use yarn to install
yarn add rc-keep-alive-dom

```

## Example

```tsx
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
        disableTransitions={['/']}
      />
    </div>
  );
};

export default Layout;
```

[demo](https://codesandbox.io/p/sandbox/7gqc3m?file=%2Fsrc%2Flayout%2FLayout.tsx)

## Document

[see me](https://anycloud666.github.io/rc-keep-alive-dom)

[see me](https://anycloud666.github.io/rc-keep-alive-dom)

[see me](https://anycloud666.github.io/rc-keep-alive-dom)

## Development

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm start

# build library source code
$ pnpm run build

# build library source code in watch mode
$ pnpm run build:watch

# build docs
$ pnpm run docs:build

# Locally preview the production build.
$ pnpm run docs:preview

# check your project for potential problems
$ pnpm run doctor
```

## LICENSE

MIT
