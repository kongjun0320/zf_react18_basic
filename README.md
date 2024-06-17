# React 18

```js
import { jsx as _jsx } from 'react/jsx-runtime';
import { jsxs as _jsxs } from 'react/jsx-runtime';
const element = _jsxs('h1', {
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
```
