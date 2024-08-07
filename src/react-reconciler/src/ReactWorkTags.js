// 函数组件
export const FunctionComponent = 0;
export const ClassComponent = 1;
// 后面会讲到组件，类组件和函数组件，因为它们都是函数，刚开始定义为未决定的类型
export const IndeterminateComponent = 2; // Before we know whether it is function or class
// 根 fiber 的 tag，每种虚拟 DOM 都会对应自己的 fiber tag 类型
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
// 原生节点 div span h1
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
// 纯文本节点
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
export const TracingMarkerComponent = 25;
