import { createHostRootFiber } from './ReactFiber';
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue';

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo; // div#root
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // HostRoot 指的是根节点 #root
  const uninitializedFiber = createHostRootFiber();
  // 根容器的 current 指向当前的 fiber
  root.current = uninitializedFiber;
  // 根 fiber 的 stateNode，也就是真实 DOM 节点指向 FiberRootNode
  uninitializedFiber.stateNode = root;

  initialUpdateQueue(uninitializedFiber);

  return root;
}
