// 要想知道为什么会有 fiber，需要知道 fiber 以前是怎么工作的
// 我们有一个虚拟 DOM
let element = (
  <div id="A1">
    <div id="B1">
      <div id="C1"></div>
      <div id="C2"></div>
    </div>
    <div id="B2"></div>
  </div>
);

let vDom = {
  type: 'div',
  key: 'A1',
  props: {
    id: 'A1',
    children: [
      {
        type: 'div',
        key: 'B1',
        props: {
          id: 'B1',
          children: [
            {
              type: 'div',
              key: 'C1',
              props: { id: 'C1' },
            },
            {
              type: 'div',
              key: 'C2',
              props: { id: 'C2' },
            },
          ],
        },
      },
      {
        type: 'div',
        key: 'B2',
        props: { id: 'B2' },
      },
    ],
  },
};

// 以前我们直接把 vDom 渲染成了真实 DOM
function render(vDom, container) {
  // 根据虚拟 DOM 生成真实 DOM
  let dom = document.createElement(vDom.type);
  // 把除 children 以外的属性拷贝到真实 DOM 上
  Object.keys(vDom.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      dom[key] = vDom.props[key];
    });
  // ! 比如：代码执行到此，想中断，就回不来了，因为执行栈已经回收了
  // 把虚拟 DOM 的子节点，也渲染到父节点真实 DOM 上
  if (Array.isArray(vDom.props.children)) {
    vDom.props.children.forEach((child) => render(child, dom));
  }
  container.appendChild(dom);
}
render(vDom, document.getElementById('root'));
