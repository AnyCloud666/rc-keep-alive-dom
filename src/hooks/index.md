---
order: 1
toc: content
group:
  # title: hooks
  order: 2
  second:
    title: hooks
    order: 2
---

## useActivated

当路由或组件被激活时触发该生命周期

```js
import { useActivated } from 'rc-keep-alive-dom';

function Page() {
  useActivated(() => {
    console.log('page1 is activated');
  });

  return <div>page1</div>;
}
```

## useUnActivated

当路由或组件被切换时调用该生命周期

```js
import { useUnActivated } from 'rc-keep-alive-dom';

function Page() {
  useUnActivated(() => {
    console.log('page1 is unactivated');
  });

  return <div>page1</div>;
}
```

## useKeepAliveContext

在被缓存的组件中获取缓存的上下文

```js
import { useKeepAliveContext } from 'rc-keep-alive-dom';
function Page() {
  const ctx = useKeepAliveContext();
  return <div>{ctx.active}</div>;
}
```

返回值 ctx 包含以下属性：

| 属性          | 说明                     | 类型                              | 默认值 |
| ------------- | ------------------------ | --------------------------------- | ------ |
| active        | 当前路由/组件是否激活    | boolean                           | -      |
| refresh       | 刷新缓存                 | (cacheActiveName?:string) => void | -      |
| destroy       | 销毁缓存                 | (cacheActiveName?:string) => void | -      |
| destroyAll    | 销毁所有缓存             | () => void                        | -      |
| destroyOthers | 销毁除当前之外的所有缓存 | (cacheActiveName?:string) => void | -      |
| getCacheNodes | 获取缓存节点             | () => React.ReactNode[]           | -      |

## useTransition

当使用 transition='customer' 进行过渡时，将会触发该生命周期

```js
import { useTransition } from 'rc-keep-alive-dom';

function Page() {
  useTransition((t) => {
    console.log('t'); //  { name: string, type: 'start' | 'end', time: number }
  });

  return <div>page1</div>;
}
```
