export interface DataRow {
  [key: string]: any;
}

export interface DataAnalysis {
  totalRows: number;
  totalColumns: number;
  nullValues: number;
  duplicates: number;
  columnTypes: { [key: string]: string };
  emptyRows: number;
}

export interface ProcessingOptions {
  removeDuplicates: boolean;
  handleNulls: 'remove' | 'fill' | 'keep';
  fillValue: string;
  removeEmptyRows: boolean;
  trimWhitespace: boolean;
  standardizeText: boolean;
  convertTypes: boolean;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  data: DataRow[];
  analysis: DataAnalysis;
}