class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function preOrderTraversal(node) {
  if (!node) return;

  console.log(node.value); // 访问节点
  preOrderTraversal(node.left);
  preOrderTraversal(node.right);
}

function inOrderTraversal(node) {
  if (!node) return;

  inOrderTraversal(node.left);
  console.log(node.value); // 访问节点
  inOrderTraversal(node.right);
}

function postOrderTraversal(node) {
  if (!node) return;

  postOrderTraversal(node.left);
  postOrderTraversal(node.right);
  console.log(node.value); // 访问节点
}

// 构建示例树
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);

// 测试前序遍历
console.log('Pre-order Traversal:');
preOrderTraversal(root);

// 测试中序遍历
console.log('In-order Traversal:');
inOrderTraversal(root);

// 测试后序遍历
console.log('Post-order Traversal:');
postOrderTraversal(root);
