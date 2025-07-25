import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProcessingOptions as ProcessingOptionsType, FileData } from '../types/data';
import { Settings, Play, Trash2, Edit, Type, Zap, ArrowLeft } from 'lucide-react';

interface ProcessingOptionsProps {
  fileData: FileData;
  onProcess: (options: ProcessingOptionsType) => void;
  onBack: () => void;
  loading: boolean;
}

export const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({ 
  fileData, 
  onProcess, 
  onBack,
  loading 
}) => {
  const [options, setOptions] = useState<ProcessingOptionsType>({
    removeDuplicates: fileData.analysis.duplicates > 0,
    handleNulls: fileData.analysis.nullValues > 0 ? 'remove' : 'keep',
    fillValue: 'N/A',
    removeEmptyRows: fileData.analysis.emptyRows > 0,
    trimWhitespace: true,
    standardizeText: false,
    convertTypes: true
  });

  const handleOptionChange = (key: keyof ProcessingOptionsType, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getEstimatedResults = () => {
    let estimatedRows = fileData.analysis.totalRows;
    
    if (options.removeEmptyRows) {
      estimatedRows -= fileData.analysis.emptyRows;
    }
    
    if (options.removeDuplicates) {
      estimatedRows -= fileData.analysis.duplicates;
    }
    
    if (options.handleNulls === 'remove') {
      // Rough estimate - assume some rows will be completely removed
      const rowsWithNulls = Math.ceil(fileData.analysis.nullValues / fileData.analysis.totalColumns);
      estimatedRows -= Math.min(rowsWithNulls, estimatedRows);
    }
    
    return Math.max(1, estimatedRows);
  };

  const optionItems = [
    {
      id: 'removeDuplicates',
      title: 'Remove Duplicates',
      description: `Found ${fileData.analysis.duplicates} duplicate rows`,
      icon: <Trash2 className="w-5 h-5" />,
      enabled: options.removeDuplicates,
      disabled: fileData.analysis.duplicates === 0,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'removeEmptyRows',
      title: 'Remove Empty Rows',
      description: `Found ${fileData.analysis.emptyRows} empty rows`,
      icon: <Trash2 className="w-5 h-5" />,
      enabled: options.removeEmptyRows,
      disabled: fileData.analysis.emptyRows === 0,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'trimWhitespace',
      title: 'Trim Whitespace',
      description: 'Remove leading and trailing spaces',
      icon: <Edit className="w-5 h-5" />,
      enabled: options.trimWhitespace,
      disabled: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'standardizeText',
      title: 'Standardize Text',
      description: 'Convert text to proper title case',
      icon: <Type className="w-5 h-5" />,
      enabled: options.standardizeText,
      disabled: false,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'convertTypes',
      title: 'Auto-Convert Types',
      description: 'Automatically detect and convert data types',
      icon: <Zap className="w-5 h-5" />,
      enabled: options.convertTypes,
      disabled: false,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-white">Processing Options</h1>
                <p className="text-blue-200">Configure how you want to clean your data</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-4">
            {optionItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 transition-all duration-300
                  ${item.disabled ? 'opacity-50' : 'hover:bg-white/15'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} mr-4`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-blue-200">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => handleOptionChange(item.id as keyof ProcessingOptionsType, e.target.checked)}
                        disabled={item.disabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
                    </label>
                  </div>
                </div>

                {item.id === 'handleNulls' && (
                  <div className="mt-4 space-y-2">
                    <p className="text-white font-medium">Handle null values:</p>
                    <div className="flex space-x-4">
                      {['keep', 'remove', 'fill'].map((method) => (
                        <label key={method} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="nullHandling"
                            value={method}
                            checked={options.handleNulls === method}
                            onChange={(e) => handleOptionChange('handleNulls', e.target.value)}
                            className="mr-2 text-blue-500"
                          />
                          <span className="text-blue-200 capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                    {options.handleNulls === 'fill' && (
                      <input
                        type="text"
                        value={options.fillValue}
                        onChange={(e) => handleOptionChange('fillValue', e.target.value)}
                        placeholder="Fill value"
                        className="mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Null handling section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 mr-4">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Handle Null Values</h3>
                  <p className="text-blue-200">Found {fileData.analysis.nullValues} null values</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {['keep', 'remove', 'fill'].map((method) => (
                  <label key={method} className="flex items-center cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="nullHandling"
                      value={method}
                      checked={options.handleNulls === method}
                      onChange={(e) => handleOptionChange('handleNulls', e.target.value as any)}
                      className="mr-3 text-blue-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-white font-medium capitalize">{method} null values</span>
                      <p className="text-blue-200 text-sm">
                        {method === 'keep' && 'Leave null values as they are'}
                        {method === 'remove' && 'Remove rows containing null values'}
                        {method === 'fill' && 'Replace null values with a custom value'}
                      </p>
                    </div>
                  </label>
                ))}
                
                {options.handleNulls === 'fill' && (
                  <input
                    type="text"
                    value={options.fillValue}
                    onChange={(e) => handleOptionChange('fillValue', e.target.value)}
                    placeholder="Enter fill value"
                    className="w-full mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Processing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Original Rows:</span>
                  <span className="text-white font-semibold">{fileData.analysis.totalRows.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Estimated Result:</span>
                  <span className="text-green-400 font-semibold">{getEstimatedResults().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Reduction:</span>
                  <span className="text-yellow-400 font-semibold">
                    {((fileData.analysis.totalRows - getEstimatedResults()) / fileData.analysis.totalRows * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProcess(options)}
              disabled={loading}
              className={`
                w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300
                ${loading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:shadow-xl'
                }
                text-white
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Start Processing
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};