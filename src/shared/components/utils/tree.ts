import type { FileNode } from "../types";

/* ===========================
   Find File
=========================== */

export function findFileById(
  nodes: FileNode[],
  id: string
): FileNode | null {
  for (const node of nodes) {
    if (node.type === "file" && node.id === id) {
      return node;
    }

    if (node.children) {
      const result = findFileById(node.children, id);

      if (result) return result;
    }
  }

  return null;
}

/* ===========================
   Find Folder
=========================== */

export function findFolderById(
  nodes: FileNode[],
  id: string
): FileNode | null {
  for (const node of nodes) {
    if (node.type === "folder" && node.id === id) {
      return node;
    }

    if (node.children) {
      const result = findFolderById(node.children, id);

      if (result) return result;
    }
  }

  return null;
}

/* ===========================
   Find Any Node
=========================== */

export function findNodeById(
  nodes: FileNode[],
  id: string
): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    if (node.children) {
      const result = findNodeById(node.children, id);

      if (result) return result;
    }
  }

  return null;
}

/* ===========================
   Find Parent
=========================== */

export function findParentNode(
  nodes: FileNode[],
  childId: string
): FileNode | null {
  for (const node of nodes) {
    if (node.children?.some((child) => child.id === childId)) {
      return node;
    }

    if (node.children) {
      const result = findParentNode(node.children, childId);

      if (result) return result;
    }
  }

  return null;
}

/* ===========================
   Name Exists
=========================== */

export function nameExists(
  folder: FileNode,
  name: string
) {
  if (!folder.children) return false;

  return folder.children.some(
    (child) =>
      child.name.toLowerCase() ===
      name.toLowerCase()
  );
}

/* ===========================
   Rename
=========================== */

export function renameNode(
  nodes: FileNode[],
  id: string,
  newName: string
) {
  const node = findNodeById(nodes, id);

  if (!node) return false;

  const parent = findParentNode(nodes, id);

  if (
    parent &&
    nameExists(parent, newName)
  ) {
    return false;
  }

  node.name = newName;

  return true;
}

/* ===========================
   Delete
=========================== */

export function deleteNode(
  nodes: FileNode[],
  id: string
): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1);
      return true;
    }

    if (nodes[i].children) {
      const deleted = deleteNode(
        nodes[i].children!,
        id
      );

      if (deleted) return true;
    }
  }

  return false;
}

/* ===========================
   Generate Id
=========================== */

export function generateId() {
  return crypto.randomUUID();
}