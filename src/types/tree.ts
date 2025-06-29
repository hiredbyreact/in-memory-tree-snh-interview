/**
 * Represents a node in a tree structure
 */
export interface TreeNode {
    /** Unique identifier for the node */
    id: number;
    
    /** Display label for the node */
    label: string;
    
    /** Array of child nodes */
    children: TreeNode[];
  }
  