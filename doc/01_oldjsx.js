// react 17 之前，babel 转换是老的写法
const babel = require('@babel/core');
const sourceCode = `
<h1>
hello <span style={{ color: 'red' }}>world</span>
</h1>
`;
const result = babel.transform(sourceCode, {
  plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'classic' }]],
});

console.log(result);

React.createElement(
  'h1',
  null,
  'hello ',
  React.createElement(
    'span',
    {
      style: {
        color: 'red',
      },
    },
    'world'
  )
);
