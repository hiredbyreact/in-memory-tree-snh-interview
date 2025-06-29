# Tree API Server

A RESTful API server for managing hierarchical tree data structures with in-memory storage and file persistence.

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

## 🧪 Testing

Run the test suite:
```bash
yarn test
```

Run tests with coverage:
```bash
yarn test:coverage
```

## 📁 Project Structure

```
in-memory-tree-snh-interview/
├── src/
│   ├── database/
│   │   ├── index.ts              # Database exports
│   │   └── tree.ts               # Tree database implementation
│   ├── routes/
│   │   └── tree.ts               # Tree API routes
│   ├── types/
│   │   ├── index.ts              # Type exports
│   │   └── tree.ts               # Tree type definitions
│   ├── utils/
│   │   ├── index.ts              # Utility exports
│   │   └── fileUtils.ts          # File operation utilities
│   └── index.ts                  # Main server file
├── tests/
│   └── tree.test.ts              # E2E API tests
├── data/
│   └── trees.json                # Persistent storage file
├── dist/                         # Compiled JavaScript output
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