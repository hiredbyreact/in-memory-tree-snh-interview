# Tree API Server

A RESTful API server for managing hierarchical tree data structures with in-memory storage and file persistence.

## 📑 Table of Contents
- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Running the Server](#-running-the-server)
- [Current Implementation Status](#-current-implementation-status)
- [API Documentation](#-api-documentation)
- [Usage Examples](#-usage-examples)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Data Structure](#-data-structure)
- [Configuration](#-configuration)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)

## 🚀 Features

- **Tree Management**: Create and retrieve hierarchical tree structures
- **Persistent Storage**: Data is retained between server restarts using JSON file storage
- **RESTful API**: Clean HTTP endpoints for tree operations
- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast and lightweight web framework

## 📋 Requirements

- Node.js (version 14 or higher)
- Yarn package manager

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/hiredbyreact/in-memory-tree-snh-interview.git
cd in-memory-tree-snh-interview
```

2. Install dependencies:
```bash
yarn install
```

3. Build the project:
```bash
yarn build
```

## 🚀 Running the Server

### Development Mode (with hot reload)
```bash
yarn dev
```

### Production Mode
```bash
yarn start
```

The server will start on `http://localhost:3000` by default.

## 🚧 Current Implementation Status

✅ **Completed:**
- Tree database with file persistence
- RESTful API routes (`GET /api/tree`, `POST /api/tree`)
- Comprehensive test suite (25 tests, 78% coverage)
- TypeScript implementation with proper types
- File-based persistence with JSON storage
- Input validation and error handling

⚠️ **Next Steps:**
- Integrate routes into main server (`src/index.ts`)
- Add CORS support for cross-origin requests
- Optional: Add authentication/rate limiting

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Get All Trees
Retrieve all trees from the database.

**Request:**
```http
GET /api/tree
```

**Response:**
```json
[
    {
        "id": 1,
        "label": "root",
        "children": [
            {
                "id": 3,
                "label": "bear",
                "children": [
                    {
                        "id": 4,
                        "label": "cat",
                        "children": []
                    }
                ]
            },
            {
                "id": 7,
                "label": "frog",
                "children": []
            }
        ]
    }
]
```

#### 2. Create New Node
Create a new node and attach it to a specified parent node.

**Request:**
```http
POST /api/tree
Content-Type: application/json

{
    "label": "cat's child",
    "parentId": 4
}
```

**Response:**
```json
{
    "id": 8,
    "label": "cat's child",
    "children": []
}
```

### Error Responses

#### 400 Bad Request
```json
{
    "error": "Invalid request",
    "message": "Label and parentId are required"
}
```

#### 404 Not Found
```json
{
    "error": "Parent not found",
    "message": "Parent node with id 999 does not exist"
}
```

#### 500 Internal Server Error
```json
{
    "error": "Internal server error",
    "message": "Failed to create node"
}
```

## 💻 Usage Examples

### JavaScript Fetch

```javascript
// Get all trees
const trees = await fetch('http://localhost:3000/api/tree')
  .then(res => res.json());

// Add new node
const newNode = await fetch('http://localhost:3000/api/tree', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    label: 'New Child Node',
    parentId: 1
  })
}).then(res => res.json());
```

### cURL

```bash
# Get all trees
curl http://localhost:3000/api/tree

# Add new node
curl -X POST http://localhost:3000/api/tree \
  -H "Content-Type: application/json" \
  -d '{"label": "New Node", "parentId": 1}'
```

## 🧪 Testing

The project includes comprehensive testing with **25 tests** and **78% code coverage**.

### Test Structure
- **Route Tests**: API endpoint behavior and validation
- **Database Tests**: Tree operations and data persistence  
- **Utility Tests**: File operations and helper functions

### Running Tests

Run the test suite:
```bash
yarn test
```

Run tests with coverage:
```bash
yarn test:coverage
```

Run tests in watch mode:
```bash
yarn test:watch
```

### Test Features
- ✅ **Mocked file operations** - Tests don't modify actual data files
- ✅ **HTTP testing** - Full API endpoint testing with supertest
- ✅ **Error scenarios** - Comprehensive error handling validation
- ✅ **Edge cases** - Input validation and boundary testing

## 📁 Project Structure

```
in-memory-tree-snh-interview/
├── src/
│   ├── database/
│   │   ├── __tests__/
│   │   │   └── tree.test.ts      # Database unit tests
│   │   ├── index.ts              # Database exports
│   │   └── tree.ts               # Tree database implementation
│   ├── routes/
│   │   ├── __tests__/
│   │   │   └── tree.test.ts      # Route integration tests
│   │   └── tree.ts               # Tree API routes
│   ├── types/
│   │   ├── index.ts              # Type exports
│   │   └── tree.ts               # Tree type definitions
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── fileUtils.test.ts # Utility unit tests
│   │   ├── index.ts              # Utility exports
│   │   └── fileUtils.ts          # File operation utilities
│   └── index.ts                  # Main server file
├── data/
│   └── trees.json                # Persistent storage file
├── dist/                         # Compiled JavaScript output
├── jest.config.js                # Jest testing configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🏗 Data Structure

The tree nodes follow this TypeScript interface:

```typescript
interface TreeNode {
    id: number;          // Unique identifier
    label: string;       // Display name
    children: TreeNode[]; // Array of child nodes
}
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `DATA_FILE`: Path to JSON storage file (default: ./data/trees.json)

### Example .env file
```
PORT=3000
DATA_FILE=./data/trees.json
```

## 🚦 Available Scripts

- `yarn build` - Compile TypeScript to JavaScript
- `yarn start` - Start the production server
- `yarn dev` - Start development server with hot reload
- `yarn test` - Run the test suite
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn clean` - Remove compiled files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Ensure Node.js is installed (version 14+)
- Check if port 3000 is available
- Run `yarn install` to ensure dependencies are installed

**Data not persisting:**
- Check if the `data/` directory exists and is writable
- Verify file permissions on the storage file

**Tests failing:**
- Ensure all dependencies are installed
- Check if the server is not already running on the test port

## 📞 Support

For questions or issues, please open an issue on the GitHub repository or contact the development team. 