// react 17 之前，babel 转换是老的写法
const babel = require('@babel/core');
const sourceCode = `
<h1>
hello <span style={{ color: 'red' }}>world</span>
</h1>
`;
const result = babel.transform(sourceCode, {
  plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]],
});

console.log(result);

import { jsx as _jsx } from 'react/jsx-runtime';
_jsx('h1', {
  children: [
    'hello ',
    _jsx('span', {
      style: {
        color: 'red',
      },
      children: 'world',
    }),
  ],
});
