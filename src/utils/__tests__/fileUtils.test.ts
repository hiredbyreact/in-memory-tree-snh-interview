import path from "path";
import { ensureDirectory, loadDataFromFile, saveDataToFile } from "../";
import fs from "fs";
import os from "os";

describe('ensureDirectory', () => {
    let tempDir: string;
    
    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fileutils-test-'));
    });
    
    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('should create a directory if it does not exist', () => {
        const filePath = path.join(tempDir, 'nested', 'test.json');
        const dirPath = path.dirname(filePath);
        
        ensureDirectory(filePath);
        expect(fs.existsSync(dirPath)).toBe(true);
    });
    
    it('should not create a directory if it already exists', () => {
        const filePath = path.join(tempDir, 'test.json');
        const dirPath = path.dirname(filePath);
        
        // Create directory first
        fs.mkdirSync(dirPath, { recursive: true });
        
        ensureDirectory(filePath);
        expect(fs.existsSync(dirPath)).toBe(true);
    });
});

describe('saveDataToFile', () => {
    let tempDir: string;
    
    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fileutils-test-'));
    });
    
    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('should save data to file', () => {
        const filePath = path.join(tempDir, 'test.json');
        const data = { name: 'test' };
        saveDataToFile(filePath, data);
        expect(fs.existsSync(filePath)).toBe(true);
    });
});

describe('loadDataFromFile', () => {
    let tempDir: string;
    
    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fileutils-test-'));
    });
    
    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('should load data from file', () => {
        const filePath = path.join(tempDir, 'test.json');
        const data = { name: 'test' };
        
        // First save the data
        saveDataToFile(filePath, data);
        
        // Then load it
        const loadedData = loadDataFromFile(filePath);
        expect(loadedData).toEqual({ name: 'test' });
    });
    
    it('should return null if the file does not exist', () => {
        const filePath = path.join(tempDir, 'nonexistent.json');
        const data = loadDataFromFile(filePath);
        expect(data).toBeNull();
    });
});