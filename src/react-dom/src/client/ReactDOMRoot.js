import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/ReactFiberReconciler';

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  // updateContainer(children, root);
};

/**
 *
 * @param {Element、Document、DocumentFragment} container div#root
 * @returns
 */
export function createRoot(container) {
  // FiberRoot
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
