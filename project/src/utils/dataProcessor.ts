import { DataRow, DataAnalysis, ProcessingOptions } from '../types/data';

export class DataProcessor {
  private data: DataRow[] = [];

  constructor(data: DataRow[]) {
    this.data = [...data];
  }

  analyzeData(): DataAnalysis {
    if (this.data.length === 0) {
      return {
        totalRows: 0,
        totalColumns: 0,
        nullValues: 0,
        duplicates: 0,
        columnTypes: {},
        emptyRows: 0
      };
    }

    const totalRows = this.data.length;
    const columns = Object.keys(this.data[0]);
    const totalColumns = columns.length;

    let nullValues = 0;
    let emptyRows = 0;
    const columnTypes: { [key: string]: string } = {};

    // Analyze each row
    this.data.forEach(row => {
      let emptyFieldsInRow = 0;
      columns.forEach(col => {
        const value = row[col];
        if (value === null || value === undefined || value === '') {
          nullValues++;
          emptyFieldsInRow++;
        }
      });
      if (emptyFieldsInRow === columns.length) {
        emptyRows++;
      }
    });

    // Determine column types
    columns.forEach(col => {
      const sampleValues = this.data.slice(0, 10).map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
      if (sampleValues.length > 0) {
        const firstValue = sampleValues[0];
        if (typeof firstValue === 'number' || !isNaN(Number(firstValue))) {
          columnTypes[col] = 'number';
        } else if (this.isDate(firstValue)) {
          columnTypes[col] = 'date';
        } else {
          columnTypes[col] = 'text';
        }
      } else {
        columnTypes[col] = 'unknown';
      }
    });

    // Count duplicates
    const duplicates = this.countDuplicates();

    return {
      totalRows,
      totalColumns,
      nullValues,
      duplicates,
      columnTypes,
      emptyRows
    };
  }

  private isDate(value: any): boolean {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && typeof value === 'string';
  }

  private countDuplicates(): number {
    const seen = new Set();
    let duplicates = 0;
    
    this.data.forEach(row => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        duplicates++;
      } else {
        seen.add(rowString);
      }
    });
    
    return duplicates;
  }

  processData(options: ProcessingOptions): DataRow[] {
    let processedData = [...this.data];

    // Remove empty rows
    if (options.removeEmptyRows) {
      processedData = this.removeEmptyRows(processedData);
    }

    // Handle null values
    if (options.handleNulls === 'remove') {
      processedData = this.removeNullRows(processedData);
    } else if (options.handleNulls === 'fill') {
      processedData = this.fillNullValues(processedData, options.fillValue);
    }

    // Remove duplicates
    if (options.removeDuplicates) {
      processedData = this.removeDuplicates(processedData);
    }

    // Trim whitespace
    if (options.trimWhitespace) {
      processedData = this.trimWhitespace(processedData);
    }

    // Standardize text
    if (options.standardizeText) {
      processedData = this.standardizeText(processedData);
    }

    // Convert types
    if (options.convertTypes) {
      processedData = this.convertTypes(processedData);
    }

    return processedData;
  }

  private removeEmptyRows(data: DataRow[]): DataRow[] {
    return data.filter(row => {
      const values = Object.values(row);
      return values.some(value => value !== null && value !== undefined && value !== '');
    });
  }

  private removeNullRows(data: DataRow[]): DataRow[] {
    return data.filter(row => {
      const values = Object.values(row);
      return !values.some(value => value === null || value === undefined || value === '');
    });
  }

  private fillNullValues(data: DataRow[], fillValue: string): DataRow[] {
    return data.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        if (newRow[key] === null || newRow[key] === undefined || newRow[key] === '') {
          newRow[key] = fillValue;
        }
      });
      return newRow;
    });
  }

  private removeDuplicates(data: DataRow[]): DataRow[] {
    const seen = new Set();
    return data.filter(row => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        return false;
      }
      seen.add(rowString);
      return true;
    });
  }

  private trimWhitespace(data: DataRow[]): DataRow[] {
    return data.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        if (typeof newRow[key] === 'string') {
          newRow[key] = newRow[key].trim();
        }
      });
      return newRow;
    });
  }

  private standardizeText(data: DataRow[]): DataRow[] {
    return data.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        if (typeof newRow[key] === 'string') {
          // Convert to title case
          newRow[key] = newRow[key].toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }
      });
      return newRow;
    });
  }

  private convertTypes(data: DataRow[]): DataRow[] {
    if (data.length === 0) return data;
    
    const columns = Object.keys(data[0]);
    const analysis = this.analyzeData();
    
    return data.map(row => {
      const newRow = { ...row };
      columns.forEach(col => {
        const type = analysis.columnTypes[col];
        if (type === 'number' && typeof newRow[col] === 'string') {
          const num = Number(newRow[col]);
          if (!isNaN(num)) {
            newRow[col] = num;
          }
        } else if (type === 'date' && typeof newRow[col] === 'string') {
          const date = new Date(newRow[col]);
          if (!isNaN(date.getTime())) {
            newRow[col] = date.toISOString().split('T')[0];
          }
        }
      });
      return newRow;
    });
  }
}