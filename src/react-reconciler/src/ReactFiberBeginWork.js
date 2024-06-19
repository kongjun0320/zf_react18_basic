import logger from 'shared/logger';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';

function updateHostRoot(current, workInProgress) {
  // 需要知道它的子虚拟 DOM，知道它的儿子的虚拟 DOM 信息
  // workInProgress.memoizedState = { element }
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  // 协调子节点 DOM-DIFF 算法
  reconcileChildren(current, workInProgress, nextChildren);
  // { type: 'h1', tag: 5  }
  return workInProgress.child;
}

function updateHostComponent(current, workInProgress) {}

/**
 * 目标是，根据虚拟 DOM 构建新的 fiber 子链表 child child.sibling
 * @param {*} current 老的 fiber
 * @param {*} workInProgress 新的 fiber
 * @returns
 */
export function beginWork(current, workInProgress) {
  logger('beginWork', workInProgress);

  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);

    case HostComponent:
      return updateHostComponent(current, workInProgress);

    case HostText:
      return null;

    default:
      return null;
  }
  return null;
}
