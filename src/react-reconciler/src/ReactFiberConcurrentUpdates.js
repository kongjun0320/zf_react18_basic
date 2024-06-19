import { HostRoot } from './ReactWorkTags';

/**
 * 本来此方法要处理优先级的问题
 * 目前只实现向上找到根节点
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  // 当前 fiber
  let node = sourceFiber;
  // 当前 fiber 父 fiber
  let parent = sourceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  // 一直找到 parent 为 null
  if (node.tag === HostRoot) {
    return node.stateNode;
  }

  return null;
}
