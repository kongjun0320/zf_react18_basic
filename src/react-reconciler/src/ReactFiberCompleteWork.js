import logger, { indent } from 'shared/logger';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
  finalizeInitialChildren,
} from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { NoFlags } from './ReactFiberFlags';

/**
 * 把当前完成的 fiber 所有的子节点对应的真实 DOM 都挂载到自己父 parent 真实 DOM 节点上
 * @param {*} parent 当前完成的 fiber 真实的DOM节点
 * @param {*} workInProgress 完成的 fiber
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    // 如果这个子节点类型是一个原生节点或者是一个文本节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 如果第一个儿子不是原生节点，说明它可能是一个函数组件
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    // 如果当前的节点没有弟弟
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      // 回到父节点
      node = node.return;
    }

    node = node.sibling;
  }
}

/**
 * 完成一个 fiber 节点
 * @param {*} current 老 fiber
 * @param {*} workInProgress 新构建的 fiber
 */
export function completeWork(current, workInProgress) {
  indent.number -= 2;
  logger(' '.repeat(indent.number) + 'completeWork', workInProgress);
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;

    case HostComponent:
      // 现在只是在处理创建或者说挂载新节点的逻辑，后面此处会进行区分是初次挂载还是更新
      // 如果完成的是原生节点
      // 创建真实的 DOM 节点
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      // 把自己所有的儿子都添加到自己的身上
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      finalizeInitialChildren(instance, type, newProps);
      // 向上冒泡属性
      bubbleProperties(workInProgress);
      break;
    case HostText:
      // 如果完成的 fiber 是文本节点，那就创建真实的文本节点
      const newText = newProps;
      // 创建真实的 DOM 节点，并赋给 stateNode
      workInProgress.stateNode = createTextInstance(newText);
      // 向上冒泡属性
      bubbleProperties(workInProgress);
      break;

    default:
      break;
  }
}

function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  // 遍历当前 fiber 的所有子节点，把所有的子节点的副作用，以及子节点的子节点的副作用全部合并
  let child = completedWork.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.subtreeFlags = subtreeFlags;
}
