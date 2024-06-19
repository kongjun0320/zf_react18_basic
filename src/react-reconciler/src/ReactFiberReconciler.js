import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue';
import { createFiberRoot } from './ReactFiberRoot';
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器，把虚拟 DOM element 变成真实 DOM 插入到 container 容器中
 * @param {*} element 虚拟 DOM
 * @param {*} container DOM 容器 FiberRootNode
 */
export function updateContainer(element, container) {
  // 获取当前的根 fiber
  const current = container.current;
  // 创建更新
  const update = createUpdate();
  // 要更新的虚拟 DOM
  update.payload = {
    element,
  };
  // 把此更新对象添加到 current 这个根 fiber 的更新队列上
  const root = enqueueUpdate(current, update);
  console.log('root >>> ', root);
  scheduleUpdateOnFiber(root);
}
