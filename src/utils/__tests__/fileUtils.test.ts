import path from "path";
import { ensureDirectory, loadDataFromFile, saveDataToFile } from "../";
import fs from "fs";

describe('ensureDirectory', () => {
    it('should create a directory if it does not exist', () => {
        const filePath = path.join(process.cwd(), 'test', 'test.json');
        const dirPath = path.dirname(filePath); // Get the directory path
        
        // Clean up first if directory exists
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
        
        ensureDirectory(filePath);
        expect(fs.existsSync(dirPath)).toBe(true);
        
        // Clean up after test
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    });
    it('should not create a directory if it already exists', () => {
        const filePath = path.join(process.cwd(), 'test', 'test.json');
        const dirPath = path.dirname(filePath);
        ensureDirectory(filePath);
        expect(fs.existsSync(dirPath)).toBe(true);
    });
});

describe('saveDataToFile', () => {
    it('should save data to file', () => {
        const filePath = path.join(process.cwd(), 'test', 'test.json');
        const data = { name: 'test' };
        saveDataToFile(filePath, data);
        expect(fs.existsSync(filePath)).toBe(true);
    });
});

describe('loadDataFromFile', () => {
    it('should load data from file', () => {
        const filePath = path.join(process.cwd(), 'test', 'test.json');
        const data = loadDataFromFile(filePath);
        expect(data).toEqual({ name: 'test' });
    });
    it('should return null if the file does not exist', () => {
        const filePath = path.join(process.cwd(), 'test', 'test20000000.json');
        const data = loadDataFromFile(filePath);
        expect(data).toBeNull();
    });
});