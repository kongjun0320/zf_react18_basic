import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import hasOwnProperty from 'shared/hasOwnProperty';

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

function hasValidKey(config) {
  return config.key !== undefined;
}

function hasValidRef(config) {
  return config.ref !== undefined;
}

function ReactElement(type, key, ref, props) {
  // 这就是 React 元素，也被称为虚拟 DOM
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type, // h1 span
    key, // 唯一标识
    ref, // 获取真实 DOM 元素
    props, // 属性 children style id
  };
}

export function jsxDEV(type, config) {
  let propName; // 属性名
  const props = {}; // 属性对象
  let key = null; // 每个虚拟 DOM 可以有一个可选的 key 属性，用来区分一个父节点下的不同子节点
  let ref = null; // 引用，后面可以通过它获取真实 DOM

  if (hasValidKey(config)) {
    key = config.key;
  }
  if (hasValidRef(config)) {
    ref = config.ref;
  }

  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }
  return ReactElement(type, key, ref, props);
}
