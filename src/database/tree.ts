import { TreeNode } from '../types/tree';
import * as path from 'path';
import { saveDataToFile, loadDataFromFile } from '../utils/fileUtils';

// Simple in-memory database for trees
export class TreeDatabase {
  private trees: TreeNode[] = [];
  private dataFilePath: string;
  private nextId: number = 1;

  constructor() {
    // Setup data file path
    this.dataFilePath = path.join(process.cwd(), 'src', 'data', 'trees.json');
    this.loadData();
  }

  // Load data from JSON file
  private loadData() {
    const parsedData = loadDataFromFile(this.dataFilePath);
    if (parsedData) {
      this.trees = parsedData.trees || [];
      this.nextId = parsedData.nextId || 1;
    }
  }

  // Save data to JSON file
  private saveData() {
    const data = {
      trees: this.trees,
      nextId: this.nextId
    };
    saveDataToFile(this.dataFilePath, data);
  }

  // Get all trees
  getAllTrees(): TreeNode[] {
    return this.trees;
  }

  // Find a node by ID (recursive search)
  private findNodeById(nodes: TreeNode[], id: number): TreeNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      // Search in children
      const found = this.findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
    return null;
  }

  // Add a new node to a parent
  addNode(label: string, parentId: number): TreeNode {
    // Find the parent node
    const parentNode = this.findNodeById(this.trees, parentId);
    
    if (!parentNode) {
      throw new Error(`Parent node with id ${parentId} not found`);
    }

    // Create new node
    const newNode: TreeNode = {
      id: this.nextId++,
      label: label,
      children: []
    };

    // Add to parent's children
    parentNode.children.push(newNode);

    // Save to file
    this.saveData();

    return newNode;
  }

  // Helper method to get next available ID
  getNextId(): number {
    return this.nextId;
  }
}

// Export singleton instance
export const treeDb = new TreeDatabase();
