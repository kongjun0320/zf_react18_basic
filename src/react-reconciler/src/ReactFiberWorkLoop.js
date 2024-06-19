import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';

let workInProgress = null;

/**
 * 计划更新 root
 * 源码中此处有一个调度任务的功能
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行 root 上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  // 告诉浏览器要执行此函数  performConcurrentWorkOnRoot
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 构建 fiber 树，要创建真实的 DOM 节点，还需要把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // console.log('performConcurrentWorkOnRoot >>> ', root);
  // 第一次渲染，以同步的方法渲染根节点，初次渲染的时候，都是同步的
  renderRootSync(root);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current);
  console.log('workInProgress >>> ', workInProgress);
}

function renderRootSync(root) {
  console.log('root >>> ', root);
  // 开始构建 fiber 树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // 获取新的 fiber 对应的老 fiber
  const current = unitOfWork.alternate;
  // 完成当前 fiber 的子 fiber 链表构建后
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 如果没有子节点，表示当前的 fiber 已经完成了
    workInProgress = null;
    // completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}
