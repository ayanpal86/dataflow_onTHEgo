import React from 'react';
import { motion } from 'framer-motion';
import { DataRow, DataAnalysis } from '../types/data';
import { CheckCircle, Download, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ProcessingResultsProps {
  originalData: DataRow[];
  processedData: DataRow[];
  originalAnalysis: DataAnalysis;
  processedAnalysis: DataAnalysis;
  fileName: string;
  onStartOver: () => void;
}

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  originalData,
  processedData,
  originalAnalysis,
  processedAnalysis,
  fileName,
  onStartOver
}) => {
  const downloadCSV = () => {
    const csv = Papa.unparse(processedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cleaned_${fileName.replace(/\.[^/.]+$/, '')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(processedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cleaned Data');
    XLSX.writeFile(wb, `cleaned_${fileName.replace(/\.[^/.]+$/, '')}.xlsx`);
  };

  const downloadJSON = () => {
    const json = JSON.stringify(processedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cleaned_${fileName.replace(/\.[^/.]+$/, '')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const improvementStats = [
    {
      label: 'Rows Cleaned',
      before: originalAnalysis.totalRows,
      after: processedAnalysis.totalRows,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Null Values',
      before: originalAnalysis.nullValues,
      after: processedAnalysis.nullValues,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Duplicates',
      before: originalAnalysis.duplicates,
      after: processedAnalysis.duplicates,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Empty Rows',
      before: originalAnalysis.emptyRows,
      after: processedAnalysis.emptyRows,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const previewData = processedData.slice(0, 5);
  const columns = processedData.length > 0 ? Object.keys(processedData[0]) : [];

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
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mr-4"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">Data Cleaned Successfully!</h1>
              <p className="text-xl text-blue-200">Your dataset has been processed and optimized</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {improvementStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} mr-3`}>
                  {stat.icon}
                </div>
                <h3 className="text-white font-semibold">{stat.label}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Before:</span>
                  <span className="text-red-300">{stat.before.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">After:</span>
                  <span className="text-green-300">{stat.after.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-blue-200">Improvement:</span>
                  <span className="text-yellow-300">
                    {stat.before > 0 ? Math.round(((stat.before - stat.after) / stat.before) * 100) : 0}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Cleaned Data Preview</h3>
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
                                <span className="text-gray-400 italic">-</span>
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
              {processedData.length > 5 && (
                <p className="text-center text-blue-200 mt-4">
                  ... and {(processedData.length - 5).toLocaleString()} more rows
                </p>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Download Options</h3>
              <div className="space-y-3">
                <button
                  onClick={downloadCSV}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download CSV
                </button>
                <button
                  onClick={downloadExcel}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Excel
                </button>
                <button
                  onClick={downloadJSON}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download JSON
                </button>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartOver}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Process Another File
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};