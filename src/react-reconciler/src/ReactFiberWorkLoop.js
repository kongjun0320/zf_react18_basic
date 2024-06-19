import { scheduleCallback } from 'scheduler';

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

function renderRootSync(root) {
  // 开始构建 fiber 树
}
