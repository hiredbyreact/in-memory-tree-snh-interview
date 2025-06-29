import { Router, Request, Response } from 'express';
import { treeDb } from '../database';

const router = Router();

// GET /api/tree - Get all trees
router.get('/', (_req: Request, res: Response) => {
  try {
    const trees = treeDb.getAllTrees();
    res.json(trees);
  } catch (error) {
    console.error('Error getting trees:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve trees'
    });
  }
});

// POST /api/tree - Create new node
router.post('/', (req: Request, res: Response) => {
  try {
    const { label, parentId } = req.body;

    // Basic validation
    if (!label || parentId === undefined) {
      res.status(400).json({
        error: 'Invalid request',
        message: 'Label and parentId are required'
      });
      return;
    }

    // Check if parentId is a number
    if (typeof parentId !== 'number') {
      res.status(400).json({
        error: 'Invalid request',
        message: 'parentId must be a number'
      });
      return;
    }

    // Create the new node
    const newNode = treeDb.addNode(label, parentId);
    
    res.status(201).json(newNode);
  } catch (error) {
    console.error('Error creating node:', error);
    
    // Check if it's a parent not found error
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        error: 'Parent not found',
        message: error.message
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create node'
    });
  }
});

export default router;
