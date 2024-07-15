import { createRoot } from 'react-dom/client';

function FunctionComponent() {
  return (
    <h1 id="container" onClick={() => console.log('click')}>
      hello <span style={{ color: 'red' }}>world</span>
    </h1>
  );
}
const element = <FunctionComponent />;
// 这种写法，在新版的 React 中，等于
// const element = jsx(FunctionComponent)
// 老版
// const element = React.createElement(FunctionComponent)

const root = createRoot(document.getElementById('root'));
root.render(element);
