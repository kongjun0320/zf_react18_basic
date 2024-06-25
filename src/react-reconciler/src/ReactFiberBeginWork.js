import logger, { indent } from 'shared/logger';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings/src/ReactDOMHostConfig';

/**
 * 根据新的虚拟 DOM 生成新的 fiber 链表
 * @param {*} current 老的福 fiber
 * @param {*} workInProgress 新的 fibre
 * @param {*} nextChildren 新的子虚拟 DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果此新 fiber 没有老 fiber，说明此新 fiber 是新创建的
  // 对应的老 fiber，说明此 fiber 是新创建的，如果这个父 fiber 是新创建的，它的儿子们也是新创建的
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果有老的 fiber，做 DOM-DIFF，拿老的子 fiber 链表和新的子虚拟 DOM 进行比较，进行最小化的更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  // 需要知道它的子虚拟 DOM，知道它的儿子的虚拟 DOM 信息
  // workInProgress.memoizedState = { element }
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  // nextChildren 就是新的子 虚拟 DOM
  const nextChildren = nextState.element;
  // 协调子节点 DOM-DIFF 算法
  reconcileChildren(current, workInProgress, nextChildren);
  // { type: 'h1', tag: 5  }
  return workInProgress.child;
}

/**
 * 构建原生组件的子 fiber 链表
 * @param {*} current 老 fiber
 * @param {*} workInProgress 新 fiber
 */
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  // 判断当前虚拟 DOM 它的儿子是不是文本的独生子
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  // 协调子节点 DOM-DIFF 算法
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 目标是，根据虚拟 DOM 构建新的 fiber 子链表 child child.sibling
 * @param {*} current 老的 fiber
 * @param {*} workInProgress 新的 fiber
 * @returns
 */
export function beginWork(current, workInProgress) {
  logger(' '.repeat(indent.number) + 'beginWork', workInProgress);
  indent.number += 2;

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
}
