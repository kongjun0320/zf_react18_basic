class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }
}

/**
 * 递归实现
 */
function dfsRecursive(node) {
  if (!node) return;

  console.log(node.value); // 访问节点

  node.children.forEach((child) => {
    dfsRecursive(child);
  });
}

/**
 * 栈实现
 */
function dfsIterative(node) {
  if (!node) return;

  const stack = [node];

  while (stack.length > 0) {
    const current = stack.pop();
    console.log(current.value); // 访问节点

    // 由于栈是后进先出，我们需要倒序添加子节点
    for (let i = current.children.length - 1; i >= 0; i--) {
      stack.push(current.children[i]);
    }
  }
}

// 示例使用
// dfsIterative(root);

/**
 * 广度优先遍历使用队列来实现
 */
function bfs(node) {
  if (!node) return;

  const queue = [node];

  while (queue.length > 0) {
    // 从前面删除一个
    const current = queue.shift();
    // 1 2 3
    console.log(current.value); // 访问节点

    current.children.forEach((child) => {
      queue.push(child);
    });
  }
}

// 构建示例树
const root = new TreeNode(1);
const child1 = new TreeNode(2);
const child2 = new TreeNode(3);
root.addChild(child1);
root.addChild(child2);
child1.addChild(new TreeNode(4));
child1.addChild(new TreeNode(5));
child2.addChild(new TreeNode(6));
child2.addChild(new TreeNode(7));

/**
 
{
  "value": 1,
  "children": [
    {
      "value": 2,
      "children": [
        {
          "value": 4,
          "children": []
        },
        {
          "value": 5,
          "children": []
        }
      ]
    },
    {
      "value": 3,
      "children": [
        {
          "value": 6,
          "children": []
        },
        {
          "value": 7,
          "children": []
        }
      ]
    }
  ]
}

 */

console.log('root >>> ', JSON.stringify(root, null, 2));
// 测试深度优先遍历
// console.log('DFS Recursive:');
// dfsRecursive(root);
// console.log('DFS Iterative:');
// dfsIterative(root);

// 测试广度优先遍历
console.log('BFS:');
bfs(root);
