import React from 'react';
import { motion } from 'framer-motion';
import { FileData } from '../types/data';
import { BarChart3, AlertTriangle, CheckCircle, Database, ArrowRight } from 'lucide-react';

interface DataPreviewProps {
  fileData: FileData;
  onProceed: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ fileData, onProceed }) => {
  const { data, analysis, name, size } = fileData;
  const previewData = data.slice(0, 5);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIssueColor = (count: number) => {
    if (count === 0) return 'text-green-400';
    if (count < analysis.totalRows * 0.1) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIssueIcon = (count: number) => {
    if (count === 0) return <CheckCircle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Database className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-white">Data Preview</h1>
              <p className="text-blue-200">{name} • {formatFileSize(size)}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onProceed}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Proceed to Cleaning
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-200">Total Rows:</span>
                <span className="text-white font-semibold">{analysis.totalRows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Columns:</span>
                <span className="text-white font-semibold">{analysis.totalColumns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Data Points:</span>
                <span className="text-white font-semibold">{(analysis.totalRows * analysis.totalColumns).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Data Issues</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Null Values:</span>
                <div className={`flex items-center ${getIssueColor(analysis.nullValues)}`}>
                  {getIssueIcon(analysis.nullValues)}
                  <span className="ml-2 font-semibold">{analysis.nullValues}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Duplicates:</span>
                <div className={`flex items-center ${getIssueColor(analysis.duplicates)}`}>
                  {getIssueIcon(analysis.duplicates)}
                  <span className="ml-2 font-semibold">{analysis.duplicates}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Empty Rows:</span>
                <div className={`flex items-center ${getIssueColor(analysis.emptyRows)}`}>
                  {getIssueIcon(analysis.emptyRows)}
                  <span className="ml-2 font-semibold">{analysis.emptyRows}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-green-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Column Types</h3>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.entries(analysis.columnTypes).map(([column, type]) => (
                <div key={column} className="flex justify-between text-sm">
                  <span className="text-blue-200 truncate mr-2">{column}:</span>
                  <span className={`font-semibold ${
                    type === 'number' ? 'text-blue-400' : 
                    type === 'date' ? 'text-purple-400' : 
                    'text-green-400'
                  }`}>
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Data Sample (First 5 rows)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  {columns.map((column, index) => (
                    <th key={index} className="text-left p-3 text-blue-200 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-3 text-white">
                        <div className="max-w-xs truncate">
                          {row[column] === null || row[column] === undefined || row[column] === '' ? (
                            <span className="text-red-400 italic">null</span>
                          ) : (
                            String(row[column])
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > 5 && (
            <p className="text-center text-blue-200 mt-4">
              ... and {(data.length - 5).toLocaleString()} more rows
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};