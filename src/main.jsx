import { createRoot } from 'react-dom/client';
// debugger;
const element = (
  <h1>
    hello <span style={{ color: 'red' }}>world</span>
  </h1>
);
console.log(element);

const root = createRoot(document.getElementById('root'));
// console.log('root >>> ', root);
root.render(element);
