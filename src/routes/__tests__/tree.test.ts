import request from 'supertest';
import express from 'express';
import treeRouter from '../tree';
import { treeDb } from '../../database';

// Mock the database
jest.mock('../../database', () => ({
  treeDb: {
    getAllTrees: jest.fn(),
    addNode: jest.fn()
  }
}));

const mockedTreeDb = treeDb as jest.Mocked<typeof treeDb>;

// Create test app
const app = express();
app.use(express.json());
app.use('/api/tree', treeRouter);

describe('Tree Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests to keep output clean
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });

  describe('GET /api/tree', () => {
    it('should return all trees successfully', async () => {
      const mockTrees = [
        {
          id: 1,
          label: 'root',
          children: [
            {
              id: 2,
              label: 'child1',
              children: []
            }
          ]
        }
      ];

      mockedTreeDb.getAllTrees.mockReturnValue(mockTrees);

      const response = await request(app)
        .get('/api/tree')
        .expect(200);

      expect(response.body).toEqual(mockTrees);
      expect(mockedTreeDb.getAllTrees).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      mockedTreeDb.getAllTrees.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const response = await request(app)
        .get('/api/tree')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal server error',
        message: 'Failed to retrieve trees'
      });
    });

    it('should return empty array when no trees exist', async () => {
      mockedTreeDb.getAllTrees.mockReturnValue([]);

      const response = await request(app)
        .get('/api/tree')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/tree', () => {
    it('should create a new node successfully', async () => {
      const newNode = {
        id: 3,
        label: 'new child',
        children: []
      };

      mockedTreeDb.addNode.mockReturnValue(newNode);

      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'new child',
          parentId: 1
        })
        .expect(201);

      expect(response.body).toEqual(newNode);
      expect(mockedTreeDb.addNode).toHaveBeenCalledWith('new child', 1);
      expect(mockedTreeDb.addNode).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when label is missing', async () => {
      const response = await request(app)
        .post('/api/tree')
        .send({
          parentId: 1
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid request',
        message: 'Label and parentId are required'
      });
      expect(mockedTreeDb.addNode).not.toHaveBeenCalled();
    });

    it('should return 400 when label is empty string', async () => {
      const response = await request(app)
        .post('/api/tree')
        .send({
          label: '',
          parentId: 1
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid request',
        message: 'Label and parentId are required'
      });
      expect(mockedTreeDb.addNode).not.toHaveBeenCalled();
    });

    it('should return 400 when parentId is missing', async () => {
      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'test node'
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid request',
        message: 'Label and parentId are required'
      });
      expect(mockedTreeDb.addNode).not.toHaveBeenCalled();
    });

    it('should return 400 when parentId is not a number', async () => {
      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'test node',
          parentId: 'invalid'
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid request',
        message: 'parentId must be a number'
      });
      expect(mockedTreeDb.addNode).not.toHaveBeenCalled();
    });

    it('should return 400 when parentId is null', async () => {
      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'test node',
          parentId: null
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid request',
        message: 'parentId must be a number'
      });
      expect(mockedTreeDb.addNode).not.toHaveBeenCalled();
    });

    it('should return 404 when parent node is not found', async () => {
      mockedTreeDb.addNode.mockImplementation(() => {
        throw new Error('Parent node with id 999 not found');
      });

      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'orphan node',
          parentId: 999
        })
        .expect(404);

      expect(response.body).toEqual({
        error: 'Parent not found',
        message: 'Parent node with id 999 not found'
      });
      expect(mockedTreeDb.addNode).toHaveBeenCalledWith('orphan node', 999);
    });

    it('should handle unexpected database errors', async () => {
      mockedTreeDb.addNode.mockImplementation(() => {
        throw new Error('Unexpected database error');
      });

      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'test node',
          parentId: 1
        })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal server error',
        message: 'Failed to create node'
      });
    });

    it('should accept parentId as 0', async () => {
      const newNode = {
        id: 5,
        label: 'root child',
        children: []
      };

      mockedTreeDb.addNode.mockReturnValue(newNode);

      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'root child',
          parentId: 0
        })
        .expect(201);

      expect(response.body).toEqual(newNode);
      expect(mockedTreeDb.addNode).toHaveBeenCalledWith('root child', 0);
    });

    it('should handle special characters in label', async () => {
      const newNode = {
        id: 6,
        label: 'special !@#$%^&*() chars',
        children: []
      };

      mockedTreeDb.addNode.mockReturnValue(newNode);

      const response = await request(app)
        .post('/api/tree')
        .send({
          label: 'special !@#$%^&*() chars',
          parentId: 1
        })
        .expect(201);

      expect(response.body).toEqual(newNode);
      expect(mockedTreeDb.addNode).toHaveBeenCalledWith('special !@#$%^&*() chars', 1);
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/tree')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      // Express handles malformed JSON and returns HTML error page
      expect(response.status).toBe(400);
      expect(response.text).toContain('SyntaxError');
    });

    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/tree')
        .send('label=test&parentId=1')
        .expect(500);

      // When body isn't parsed correctly, destructuring fails and causes 500
      expect(response.body).toEqual({
        error: 'Internal server error',
        message: 'Failed to create node'
      });
    });
  });
}); 