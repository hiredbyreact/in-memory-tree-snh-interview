import * as fs from 'fs';
import * as path from 'path';

// Make sure directory exists
export function ensureDirectory(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Save data to JSON file
export function saveDataToFile(filePath: string, data: any) {
  try {
    ensureDirectory(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
    throw new Error('Failed to save data');
  }
}

// Load data from JSON file
export function loadDataFromFile(filePath: string): any {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
} 