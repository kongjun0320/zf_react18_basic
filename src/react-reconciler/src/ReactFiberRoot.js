import { createHostRootFiber } from './ReactFiber';
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue';

// 简单来说， FiberRootNode = containerInfo，它的本质上就是一个真实的容器 DOM 节点 div#root
// 其实就是一个真实的 DOM 节点

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo; // div#root
}

/*

current 指的是当前根容器它的现在正在显示的或者说是已经渲染好的 fiber 树

*/

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // HostRoot 指的是根节点 #root
  const uninitializedFiber = createHostRootFiber();
  // 根容器的 current 指向当前的 fiber
  root.current = uninitializedFiber;
  // 根 fiber 的 stateNode，也就是真实 DOM 节点指向 FiberRootNode
  uninitializedFiber.stateNode = root;
  // 把虚拟 DOM 放在 fiber 上
  initialUpdateQueue(uninitializedFiber);

  return root;
}
