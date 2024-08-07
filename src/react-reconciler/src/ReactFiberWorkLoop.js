import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';
import { MutationMask, NoFlags, Placement } from './ReactFiberFlags';
import { commitMutationEffectsOnFiber } from './ReactFiberCommitWork';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';

/**
 
current: 当前页面显示的 fiber 树
workInProgress: 正在构建中的 fiber 树
  
 */

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
  // console.log('root >>> ', root);
  // 开始进入提交阶段，就是执行副作用，修改真实 DOM
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}

function commitRoot(root) {
  const { finishedWork } = root;
  printFinishedWork(finishedWork);
  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  // 如果自己有副作用或者子节点有副作用则进行提交 DOM 操作
  if (subtreeHasEffects || rootHasEffect) {
    // console.log('commitRoot >>> ', finishedWork.child);
    commitMutationEffectsOnFiber(finishedWork, root);
  }
  // 等 DOM 变更后，就可以让 root 的 current 指向新的 fiber 树
  root.current = finishedWork;
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current);
  // console.log('workInProgress >>> ', workInProgress);
}

function renderRootSync(root) {
  // console.log('root >>> ', root);
  // 开始构建 fiber 树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元
 * @param {*} unitOfWork
 */
function performUnitOfWork(unitOfWork) {
  // 获取新的 fiber 对应的老 fiber
  const current = unitOfWork.alternate;
  // 完成当前 fiber 的子 fiber 链表构建后
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 如果没有子节点，表示当前的 fiber 已经完成了
    // workInProgress = null;
    completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    // 执行此 fiber 的完成工作，如果是原生组件的话，就是创建真实的 DOM 节点
    // 拿到老 fiber，新 fiber
    completeWork(current, completedWork);
    // 如果有弟弟，就构建弟弟对应的 fiber 子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // 如果没有弟弟，说明这当前完成的就是父 fiber 的最后一个节点
    // 也就是说一个父 fiber，所有的子 fiber 全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}

function printFinishedWork(fiber) {
  let child = fiber.child;
  while (child) {
    printFinishedWork(child);
    child = fiber.sibling;
  }
  if (fiber.flags !== 0) {
    console.log(
      getFlags(fiber.flags),
      getTag(fiber.tag),
      fiber.type,
      fiber.memoizedProps
    );
  }
}

function getFlags(flags) {
  if (flags === Placement) {
    return '插入';
  } else if (flags === Update) {
    return '更新';
  }
  return flags;
}

function getTag(tag) {
  switch (tag) {
    case HostRoot:
      return 'HostRoot';

    case HostComponent:
      return 'HostComponent';

    case HostText:
      return 'HostText';

    default:
      return tag;
  }
}
