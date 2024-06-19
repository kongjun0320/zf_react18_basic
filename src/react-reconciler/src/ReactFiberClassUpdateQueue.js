import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates';

export function initialUpdateQueue(fiber) {
  // 创建一个新的更新队列
  // pending 其实是一个循环链表
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {};
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  // pending 要指向最后一个更新，最后一个更新 next 指向第一个更新
  // 单向循环链表
  updateQueue.shared.pending = update;
  // 返回根节点，从当前的 fiber 一直到根节点
  return markUpdateLaneFromFiberToRoot(fiber);
}
