import request from 'supertest';
import express from 'express';
import treeRouter from '../tree';
import { treeDb } from '../../database';

// Mock out any file-system interaction so the tests never touch disk
jest.mock('../../utils/fileUtils', () => ({
  saveDataToFile: jest.fn(),
  loadDataFromFile: jest.fn(() => null),
  ensureDirectory: jest.fn()
}));

// Mock the database layer the router depends on
jest.mock('../../database', () => ({
  treeDb: {
    getAllTrees: jest.fn(),
    addNode: jest.fn()
  }
}));

const mockedDb = treeDb as jest.Mocked<typeof treeDb>;

// Spin up an Express app and mount the router under test
const app = express();
app.use(express.json());
app.use('/api/tree', treeRouter);

describe('Tree API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console errors so test output stays readable
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/tree', () => {
    it('returns 200 with the list of trees', async () => {
      const sampleTrees = [{ id: 1, label: 'root', children: [] }];
      mockedDb.getAllTrees.mockReturnValue(sampleTrees);

      const res = await request(app).get('/api/tree').expect(200);

      expect(res.body).toEqual(sampleTrees);
      expect(mockedDb.getAllTrees).toHaveBeenCalledTimes(1);
    });

    it('returns 500 when the database layer throws', async () => {
      mockedDb.getAllTrees.mockImplementation(() => {
        throw new Error('Database failure');
      });

      const res = await request(app).get('/api/tree').expect(500);

      expect(res.body).toEqual({
        error: 'Internal server error',
        message: 'Failed to retrieve trees'
      });
    });
  });

  describe('POST /api/tree', () => {
    it('creates a new node and returns 201', async () => {
      const newNode = { id: 2, label: 'child', children: [] };
      mockedDb.addNode.mockReturnValue(newNode);

      const res = await request(app)
        .post('/api/tree')
        .send({ label: 'child', parentId: 1 })
        .expect(201);

      expect(res.body).toEqual(newNode);
      expect(mockedDb.addNode).toHaveBeenCalledWith('child', 1);
    });

    it.each([
      [{ parentId: 1 }, 'Label and parentId are required'],
      [{ label: 'foo' }, 'Label and parentId are required'],
      [{ label: 'foo', parentId: '' }, 'parentId must be a number']
    ])('returns 400 for invalid input %#', async (payload, expectedMessage) => {
      const res = await request(app).post('/api/tree').send(payload).expect(400);

      expect(res.body).toEqual({
        error: 'Invalid request',
        message: expectedMessage
      });
      expect(mockedDb.addNode).not.toHaveBeenCalled();
    });

    it('returns 404 when the parent cannot be found', async () => {
      mockedDb.addNode.mockImplementation(() => {
        throw new Error('Parent node with id 999 not found');
      });

      const res = await request(app)
        .post('/api/tree')
        .send({ label: 'orphan', parentId: 999 })
        .expect(404);

      expect(res.body).toEqual({
        error: 'Parent not found',
        message: 'Parent node with id 999 not found'
      });
    });

    it('returns 500 on unexpected database failure', async () => {
      mockedDb.addNode.mockImplementation(() => {
        throw new Error('Unexpected DB error');
      });

      const res = await request(app)
        .post('/api/tree')
        .send({ label: 'foo', parentId: 1 })
        .expect(500);

      expect(res.body).toEqual({
        error: 'Internal server error',
        message: 'Failed to create node'
      });
    });
  });

  describe('Edge cases', () => {
    it('responds with 400 when JSON is malformed', async () => {
      const res = await request(app)
        .post('/api/tree')
        .set('Content-Type', 'application/json')
        .send('{ bad json ')
        .expect(400);

      expect(res.text).toContain('SyntaxError');
    });
  });
}); 