import { setInitialProperties } from './ReactDOMComponent';

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === 'string' || typeof props.children === 'number'
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

export function createInstance(type) {
  const domElement = document.createElement(type);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

/**
 *
 * @param {*} parentInstance 父 DOM 节点
 * @param {*} child 子 DOM 节点
 * @param {*} beforeChild 插入到谁的前面
 */
export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
