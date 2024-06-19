import { NoFlags } from './ReactFiberFlags';
import { HostRoot } from './ReactWorkTags';

/**
 *
 * @param {*} tag fiber 的类型，函数组件0、类组件1、原生组件5、根元素 3
 * @param {*} pendingProps 新属性，等待处理或者说生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag; // fiber 的类型
  this.key = key;
  this.type = null; // fiber 类型，来自于虚拟 DOM 节点的 type（span div p）
  // 每个虚拟 DOM -> fiber 节点 -> 真实 DOM
  this.stateNode = null; // 此 fiber 对应的真实 DOM 节点 h1 -> 真实的 h1 DOM
  this.return = null; // 指向父节点
  this.child = null; // 指向第一个子节点
  this.sibling = null; // 指向弟弟
  // fiber 哪来的，通过虚拟 DOM 节点创建，虚拟 DOM 会提供 pendingProps 用来创建 fiber 节点的属性
  // 等待生效的属性
  this.pendingProps = pendingProps;
  // 已经生效的属性
  this.memoizedProps = null;
  // 每个 fiber 还有有自己的状态，每一种 fiber 状态存的类型不一样
  // 类组件的对应的 fiber 存的就是类的实例的状态，HostRoot 存的就是要渲染的元素
  this.memoizedState = null;
  // 每个 fiber 身上可能还有更新队列
  this.updateQueue = null;
  // 副作用的标识，表示要针对此 fiber 节点进行何种操作
  this.flags = NoFlags;
  // 子节点对应的副使用标识
  this.subtreeFlags = NoFlags;
  // 替身，轮替，后面的 dom-diff 时会用到
  this.alternate = null;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

/**
 * 基于老的 fiber 和新的属性创建新的 fiber
 * @param {*} current 老 fiber
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  return workInProgress;
}
