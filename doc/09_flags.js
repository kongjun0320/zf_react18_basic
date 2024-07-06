// 在 React 进行 DOM DIFF 的时候，会计算要执行的操作
const Placement = 0b001; // 1
const Update = 0b010; // 2

let flags = 0b00;
// 增加操作
flags |= Placement;
flags |= Update;

// console.log(flags.toString(2));
// console.log(flags);

// 删除操作
// ~Placement -> 0b110
// 0b011 0b110 -> ob010
flags = flags & ~Placement;

// console.log(flags.toString(2));
// console.log(flags);

// 判断是否包含
console.log((flags & Placement) === Placement);
console.log((flags & Update) === Update);
// 判断不包含
console.log((flags & Placement) === 0);
console.log((flags & Update) === 0);
