import { TreeDatabase } from "../";

// Mock file operations to prevent actual file modifications during tests
jest.mock('../../utils/fileUtils', () => ({
  saveDataToFile: jest.fn(),
  loadDataFromFile: jest.fn(() => ({
    trees: [
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
    ],
    nextId: 3
  })),
  ensureDirectory: jest.fn()
}));

describe('tree', () => {
    it('should create a new tree', () => {
        const treeDb = new TreeDatabase();
        expect(treeDb).toBeDefined();
    });

});

describe('Load tree data', () => {
    it('should load tree data from file', () => {
        const treeDb = new TreeDatabase();
        const trees = treeDb.getAllTrees();
        expect(trees).toBeDefined();
        expect(Array.isArray(trees)).toBe(true);
        expect(trees.length).toBeGreaterThan(0);
    });
});

describe('Save tree data', () => {
    it('should save tree data to file', () => {
        const treeDb = new TreeDatabase();
        treeDb.addNode('test', 1);
        expect(treeDb.getAllTrees()).toBeDefined();
    });

});

describe('Find by id', () => {
    it('should find a node by id', () => {
        const treeDb = new TreeDatabase();
        const node = treeDb['findNodeById'](treeDb.getAllTrees(), 1);
        expect(node).toBeDefined();
        expect(node?.label).toBe('root');
    });
    it('should return null if the node is not found', () => {
        const treeDb = new TreeDatabase();
        expect(treeDb['findNodeById'](treeDb.getAllTrees(), 999)).toBeNull();
    });
});