---
order: 3
toc: content
group:
  # title: 过渡动画
  order: 3
  second:
    title: 过渡动画
    order: 3
---

# 过渡动画

默认是没有过渡动画的，需要配置，`transition` 属性

- viteTransition: 浏览器默认过渡
- customer: 自定义过渡动画

## viteTransition 过渡动画

参考：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/startViewTransition)

## 自定义过渡动画

默认采用了这些活动类名：

- `keep-enter-from`
- `keep-enter-active`
- `keep-leave-active`
- `keep-leave-to`

可通过修改类名来自定义动画效果。

- `enterFromClassName`
- `enterActiveClassName`
- `leaveActiveClassName`
- `leaveToClassName`

过渡状态说明

- 进入阶段：`keep-enter-from` -> `keep-enter-active`

- 离开阶段：`keep-leave-active` -> `keep-leave-to`

## 定义 css 过渡动画

```css
/* 进入的初始状态 */
.keep-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

/* 进入的完成状态 */
.keep-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s;
}

/* 离开的初始状态 */
.keep-leave-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.5s;
}

/* 离开的完成状态 */
.keep-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
```

## 使用自定义过渡动画

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
