function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

function createUpdate() {
  return {};
}

function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const shared = updateQueue.shared;
  const pending = shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    // 如果更新队列不为空的话，取出第一个更新
    update.next = pending.next;
    // 然后让原来队列的最后一个的 next 指向新的 next
    pending.next = update;
  }
  // pending 永远是指向最新进入的
  updateQueue.shared.pending = update;
}

function processUpdateQueue(fiber) {
  const queue = fiber.updateQueue;
  const pending = queue.shared.pending;
  if (pending !== null) {
    queue.shared.pending = null;
    // 最后一个更新
    const lastPendingUpdate = pending;
    const firstPendingState = lastPendingUpdate.next;
    // 把环状链表给解开
    lastPendingUpdate.next = null;
    let newState = fiber.memoizedState;
    let update = firstPendingState;
    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    fiber.memoizedState = newState;
  }
}

function getStateFromUpdate(update, newState) {
  return Object.assign({}, newState, update.payload);
}

let fiber = { memoizedState: { id: 1 } };
initialUpdateQueue(fiber);

const update1 = createUpdate();
update1.payload = { name: 'aic' };
enqueueUpdate(fiber, update1);

const update2 = createUpdate();
update2.payload = { age: 16 };
enqueueUpdate(fiber, update2);

// 基于老状态，计算新状态
processUpdateQueue(fiber);
console.log('memoizedState >>> ', fiber.memoizedState);
