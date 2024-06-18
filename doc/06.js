// 1. 把虚拟 DOM 构建成 fiber 树
let A1 = { type: 'div', props: { id: 'A1' } };
let B1 = { type: 'div', props: { id: 'B1' }, return: A1 };
let B2 = { type: 'div', props: { id: 'B2' }, return: A1 };
let C1 = { type: 'div', props: { id: 'C1' }, return: B1 };
let C2 = { type: 'div', props: { id: 'C2' }, return: B1 };

/*
        A1
        
    B1      B2

C1      C2
*/

// A1 的第一个子节点 B1
A1.child = B1;
// B1 的弟弟是 B2
B1.sibling = B2;
// B1 的第一个子节点 C1
B1.child = C1;
// C1的弟弟是 C2
C1.sibling = C2;

// 下一个工作单元
let nextUnitOfWork = null;
// render 工作循环
function workLoop() {
  // 工作循环每一次处理一个 fiber，处理完以后可以暂停
  // 如果有下一个任务并且有剩余的时间，执行下一个工作单元  && hasRemainingTime
  // A1
  while (nextUnitOfWork) {
    //执行一个任务并返回下一个任务
    // B1
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  console.log('render阶段结束');
  //render阶段结束
}

// A1
function performUnitOfWork(fiber) {
  // B1 C1
  let child = beginWork(fiber);
  // 如果执行完 A1 后，会返回 A1 的第一个子节点
  if (child) {
    return child;
  }
  // 如果没有子节点
  while (fiber) {
    //如果没有子节点说明当前节点已经完成了渲染工作
    completeUnitOfWork(fiber); //可以结束此fiber的渲染了
    if (fiber.sibling) {
      //如果它有弟弟就返回弟弟
      return fiber.sibling;
    }
    fiber = fiber.return; //如果没有弟弟让爸爸完成，然后找叔叔
  }
}

function beginWork(fiber) {
  console.log('beginWork', fiber.props.id);
  return fiber.child;
}

function completeUnitOfWork(fiber) {
  console.log('completeUnitOfWork', fiber.props.id);
}
debugger;
nextUnitOfWork = A1;
workLoop();

/**
 * 
 先执行当前 fiber
 有大儿子执行大儿子
 没有大儿子执行弟弟
 没有弟弟找叔叔

 每一个 fiber 执行完成后都可以放弃执行，让浏览器执行更高优先级的任务，等待浏览器执行完后再回来执行下一个 fiber
 
 */
