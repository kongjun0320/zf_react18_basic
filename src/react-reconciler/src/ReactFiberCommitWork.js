import { MutationMask, Placement } from './ReactFiberFlags';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';

function recursivelyTraverseMutationEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork;
  // 如果此 fiber 要执行插入操作的话
  if (flags & Placement) {
    // 进行插入操作，也就是把此 fiber 对应的真实 DOM 节点添加到父真实 DOM 节点上
    commitPlacement(finishedWork);
    // 把 flags 里面的 Placement 删除
    finishedWork.flags & ~Placement;
  }
}

function commitPlacement(finishedWork) {
  console.log('finishedWork >>> ', finishedWork);
}

/**
 * 遍历 fiber 树，执行 fiber 上的副作用
 * @param {*} finishedWork fiber 节点
 * @param {*} root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
  switch (finishedWork.tag) {
    case HostRoot:
    case HostComponent:
    case HostText:
      // 先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      break;

    default:
      break;
  }
}
