import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement } from './ReactFiber';
import { Placement } from './ReactFiberFlags';

/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, newChild) {
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
  }

  return reconcileChildFibers;
}

// 有老父 fiber 更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true);
// 没有老父 fiber，初次挂在的时候用这个
export const mountChildFibers = createChildReconciler(false);
