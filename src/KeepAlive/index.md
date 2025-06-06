---
order: 1
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: 组件缓存
    order: 2
---

# 组件缓存

```js
import { KeepAlive } from 'rc-keep-alive-dom';
import { useState } from 'react';

const Tabs = () => {
  const [activeKey, setActiveKey] = useState('tab1');

  return (
    <div>
      <button onClick={() => setActiveKey('tab1')}>tab1</button>
      <button onClick={() => setActiveKey('tab2')}>tab2</button>
      <button onClick={() => setActiveKey('tab3')}>tab3</button>
      <KeepAlive activeName={activeKey}>
        {activeKey === 'tab1' && <div>tab1 content</div>}
        {activeKey === 'tab2' && <div>tab2 content</div>}
        {activeKey === 'tab3' && <div>tab3 content</div>}
      </KeepAlive>
    </div>
  );
};

return Tabs;
```

## 属性

| 属性                     | 说明                                  | 类型                                        | 默认值                     |
| ------------------------ | ------------------------------------- | ------------------------------------------- | -------------------------- |
| cacheMaxSize             | 缓存最大个数                          | number                                      | 20                         |
| cacheMaxTime             | 缓存最大时间,默认全部缓存             | number \| Record<string,number>             | undefined                  |
| include                  | 缓存的路由名称                        | Array<string \| RegExp> \| string \| RegExp | -                          |
| exclude                  | 不缓存的路由名称                      | Array<string \| RegExp> \| string \| RegExp | -                          |
| wrapperId                | 包裹元素的 id                         | string                                      | keep-alive-container       |
| wrapperClassName         | 包裹元素的 className                  | string                                      | keep-alive-container       |
| wrapperStyle             | 包裹元素的 style                      | React.CSSProperties                         | { height: '100%' }         |
| wrapperChildrenId        | 包裹子元素的 id                       | string                                      | keep-alive-container-child |
| wrapperChildrenClassName | 包裹子元素的 className                | string                                      | keep-alive-container-child |
| wrapperChildrenStyle     | 包裹子元素的 style                    | React.CSSProperties                         | { height: '100%' }         |
| transition               | 过渡切换                              | customer \| viteTransition \| undefined     | undefined                  |
| disableTransitions       | 过渡动画的路由或组件                  | Array<string \| RegExp> \| string \| RegExp | -                          |
| duration                 | 过渡切换持续时间                      | number                                      | 300                        |
| enterFromClassName       | 进入初始状态 动画类名                 | string                                      | keep-enter-from            |
| enterActiveClassName     | 进入动画状态 动画类名                 | string                                      | keep-enter-active          |
| leaveActiveClassName     | 离开动画状态 动画类名                 | string                                      | keep-leave-active          |
| leaveToClassName         | 离开最终状态 动画类名                 | string                                      | keep-leave-to              |
| recordScrollPosition     | 记录缓存节点的滚动位置                | boolean                                     | false                      |
| aliveRef                 | 缓存引用                              | RefObject\<KeepAliveRef\>                   | null                       |
| includeIframe            | 缓存 iframe 路由， exclude 优先级更高 | Array<string \| RegExp> \| string \| RegExp | -                          |

## 方法

| 方法 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| -    | -    | -    | -      |

## 引用 aliveRef

| 属性          | 说明                     | 类型                              | 默认值 |
| ------------- | ------------------------ | --------------------------------- | ------ |
| refresh       | 刷新缓存                 | (cacheActiveName?:string) => void | -      |
| destroy       | 销毁缓存                 | (cacheActiveName?:string) => void | -      |
| destroyAll    | 销毁所有缓存             | () => void                        | -      |
| destroyOthers | 销毁除当前之外的所有缓存 | (cacheActiveName?:string) => void | -      |
| getCacheNodes | 获取缓存节点             | () => React.ReactNode[]           | -      |
