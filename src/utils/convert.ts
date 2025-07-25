import type { TreeProps } from "ant-design-vue";
import type { DocumentTreeVO } from "@/types/document";

export function convertToTreeData(
  data: DocumentTreeVO[]
): TreeProps["treeData"] {
  const map = new Map<string, any>();
  const roots: any[] = [];

  // 先将所有节点放入map
  data.forEach(item => {
    map.set(item.id, {
      key: item.id,
      title: item.title,
      sort: item.sort ?? 1,
      created_at: item.created_at,
      children: [],
    });
  });

  // 构建树结构
  data.forEach(item => {
    const node = map.get(item.id);
    const parent = map.get(item.parent_id);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // 递归排序每层children，先按sort升序，再按created_at升序
  function sortTree(nodes: any[]) {
    nodes.sort((a, b) => {
      const sortA = a.sort ?? 0;
      const sortB = b.sort ?? 0;
      if (sortA !== sortB) {
        return sortA - sortB;
      }
      // created_at 升序
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children);
      }
    });
  }
  sortTree(roots);

  // 移除created_at字段，保持返回结构不变
  function clean(nodes: any[]) {
    nodes.forEach(node => {
      delete node.created_at;
      if (node.children && node.children.length > 0) {
        clean(node.children);
      }
    });
  }
  clean(roots);

  return roots;
}

export interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

export function convertToSelectTree(data: DocumentTreeVO[]): TreeNode[] {
  const idToNodeMap = new Map<string, TreeNode>();
  const result: TreeNode[] = [];

  // 初始化节点 map
  for (const item of data) {
    idToNodeMap.set(item.id, {
      label: item.alias || item.title,
      value: item.id,
      children: [],
    });
  }

  // 构建树结构
  for (const item of data) {
    const node = idToNodeMap.get(item.id)!;
    if (item.parent_id && idToNodeMap.has(item.parent_id)) {
      const parent = idToNodeMap.get(item.parent_id)!;
      parent.children!.push(node);
    } else {
      result.push(node);
    }
  }

  // 清理空 children 数组
  const clean = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        clean(node.children);
      }
    }
  };
  clean(result);

  // 包一层根目录
  const documentId = data[0]?.document_id || "root";
  return [
    {
      label: "根目录",
      value: documentId,
      children: result,
    },
  ];
}

export function findNodeByKey(
  tree: TreeProps["treeData"],
  key: string
): any | null {
  for (const node of tree || []) {
    if (node.key === key) return node;
    const found = findNodeByKey(node.children, key);
    if (found) return found;
  }
  return null;
}

export function getChildrenLengthByKey(
  tree: TreeProps["treeData"],
  key: string
): number {
  return findNodeByKey(tree, key)?.children?.length || 0;
}

export function getAllChildIdByParentId(
  tree: TreeProps["treeData"],
  parentKey: string
): string[] {
  const result: string[] = [];
  const startNode = findNodeByKey(tree, parentKey);
  if (!startNode) return result;

  const dfs = (node: any) => {
    result.push(node.key);
    node.children?.forEach(dfs);
  };

  dfs(startNode);
  return result;
}
