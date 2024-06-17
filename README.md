# React 18

```js
import { jsx as _jsx } from 'react/jsx-runtime';
import { jsxs as _jsxs } from 'react/jsx-runtime';
const element = _jsxs('h1', {
  children: [
    'hello ',
    _jsx('span', {
      style: {
        color: 'red',
      },
      children: 'world',
    }),
  ],
});
```

# 性能瓶颈

- JS 任务执行时间过长

  - 浏览器刷新频率为 60 Hz，大概 16.6 毫秒渲染一次，而 JS 线程和渲染线程是互斥的，所以如果 JS 线程执行任务时间超过 16.6 毫秒的话，就会导致掉帧，导致卡顿，解决方案就是 React 利用空闲的时间进行更新，不影响渲染进程的渲染

  - 把一个耗时任务拆分成一个个小任务，分布在每一帧里的方式就叫时间切片

- 屏幕刷新率

  - 目前大多数设备的屏幕刷新率为 60 次/秒
  - 浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致
  - 页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的，小于这个值时，用户会感觉到卡顿
  - 每个帧的预算时间时 16.66 毫秒（1 秒 60）
  - 1s 60 帧，所以每一帧分到的时间是 1000/60 -> 16ms，所以我们书写代码时力求不让一帧的工作量超过 16 ms

- 帧

  - 每个帧的开头包括样式计算、布局和绘制
  - JavaScript 执行 JavaScript 引擎和页面渲染引擎在同一个渲染线程、GUI 渲染和 JavaScript 执行两者是互斥的
  - 如果某个任务执行时间过长，浏览器会推迟渲染

- requestIdleCallback

  - 我们希望快速响应用户，让用户觉得快，不能阻塞用户的交互
  - `requestIdleCallback` 使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入相应
  - 正常帧任务完成后没超过 16 ms，说明时间有剩余，此时就会执行 `requestIdleCallback` 里注册的任务

# fiber

- 我们可以通过某些调度策略合理分配 CPU 资源，从而提高用户的响应速度
- 通过 fiber 架构，让自己的调和过程变成可中断，适时地让出 CPU 执行权，除了让浏览器及时地响应用户的交互

- fiber 是一个执行单元
  - Fiber 是一个执行单元，每次执行完一个执行单元，React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去
- fiber 是一种数据结构
  - React 目前的做法是使用链表，每个虚拟节点内部表示为一个 fiber
  - 从顶点开始遍历
  - 如果有第一个儿子，先遍历第一个儿子
  - 如果没有第一个儿子，标志着此节点遍历完成
  - 如果有弟弟就遍历
  - 如果没有下一个弟弟，返回父节点标识完成父节点，如果有叔叔遍历叔叔
  - 没有父节点遍历结束

> fiber 是一个数据结构，为什么需要这样一个数据结构呢？因为我们希望把构建 fiber 树的过程，或者说渲染的过程变得可中断，可暂定和恢复。
