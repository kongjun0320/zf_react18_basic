import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText } from './ReactFiber';
import { Placement } from './ReactFiberFlags';
import isArray from 'shared/isArray';

/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 因为我们现在实现的是初次挂载，老节点 currentFirstFiber 肯定是没有的，所以可以直接根据虚拟 DOM 创建新的 fiber 节点
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  /**
   * 设置副作用
   * @param {*} newFiber
   * @returns
   */
  function placeSingleChild(newFiber) {
    // 说明要添加副作用
    if (shouldTrackSideEffects) {
      // 要在最后的提交阶段插入此节点
      // react 渲染分成渲染（创建 fiber 树）和提交（更新真实 DOM）两个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === 'string' && newChild !== '') ||
      typeof newChild === 'number'
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;

        default:
          break;
      }
    }
  }

  function placeChild(newFiber, newIndex) {
    newFiber.index = newIndex;
    if (shouldTrackSideEffects) {
      // 如果一个 fiber 它的 flags 有 placement，说明此节点需要创建真实 DOM 并且插入到父容器中
      newFiber.flags |= Placement;
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    // 返回的第一个新儿子
    let resultingFirstChild = null;
    // 上一个新的 fiber
    let previousNewFiber = null;
    let newIndex = 0;
    for (; newIndex < newChildren.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChildren[newIndex]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIndex);
      // 如果 previousNewFiber 为 null，说明这是第一个 fiber
      if (previousNewFiber === null) {
        // 这个 newFiber 就是大儿子
        resultingFirstChild = newFiber;
      } else {
        // 否则说明，这个不是大儿子，就把这个 newFiber 添加上一个子节点后面
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  /**
   * 比较子 fiber，DOM-DIFF 用老的子 fiber 链表和新的虚拟 DOM 进行比较的过程
   * @param {*} returnFiber 新的父 fiber
   * @param {*} currentFirstFiber 老 fiber 第一个子 fiber，current 一般来说指的是老
   * @param {*} newChild 新的子虚拟 DOM，h1 虚拟 DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    // 现在暂时只考虑新的节点只有一个的情况
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );

        default:
          break;
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }

  return reconcileChildFibers;
}

// 有老父 fiber 更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true);
// 没有老父 fiber，初次挂在的时候用这个
export const mountChildFibers = createChildReconciler(false);
