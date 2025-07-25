import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataRow } from '../types/data';

export class FileParser {
  static async parseFile(file: File): Promise<DataRow[]> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'csv':
        return this.parseCSV(file);
      case 'xlsx':
      case 'xls':
        return this.parseExcel(file);
      case 'json':
        return this.parseJSON(file);
      default:
        throw new Error('Unsupported file format');
    }
  }

  private static parseCSV(file: File): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('Error parsing CSV: ' + results.errors[0].message));
          } else {
            resolve(results.data as DataRow[]);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private static async parseExcel(file: File): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData as DataRow[]);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static async parseJSON(file: File): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          if (Array.isArray(jsonData)) {
            resolve(jsonData);
          } else {
            reject(new Error('JSON file must contain an array of objects'));
          }
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}