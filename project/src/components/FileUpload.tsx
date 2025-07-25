import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, loading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    },
    maxFiles: 1,
    disabled: loading
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-4"
          >
            <Database className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">DataFlow Pro</h1>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-blue-200"
          >
            Transform messy data into clean, structured datasets instantly
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'border-blue-400 bg-blue-500/20 scale-105' 
                : 'border-blue-300/50 hover:border-blue-400 hover:bg-blue-500/10'
              }
              ${loading ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ 
                  rotate: loading ? 360 : 0,
                  scale: isDragActive ? 1.1 : 1
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: loading ? Infinity : 0, ease: "linear" },
                  scale: { duration: 0.2 }
                }}
              >
                {loading ? (
                  <Zap className="w-16 h-16 text-yellow-400" />
                ) : (
                  <Upload className="w-16 h-16 text-blue-400" />
                )}
              </motion.div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {loading 
                    ? 'Processing your data...' 
                    : isDragActive 
                      ? 'Drop your file here' 
                      : 'Upload your dataset'
                  }
                </h3>
                <p className="text-blue-200">
                  {loading 
                    ? 'Please wait while we analyze your data'
                    : 'Drag & drop or click to select CSV, Excel, or JSON files'
                  }
                </p>
              </div>

              {!loading && (
                <div className="flex items-center space-x-6 text-sm text-blue-300">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    CSV
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Excel
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    JSON
                  </div>
                </div>
              )}
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full bg-blue-500/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
        >
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">🧹</div>
            <div className="text-white font-medium">Clean Data</div>
            <div className="text-blue-200 text-sm">Remove duplicates & nulls</div>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">⚡</div>
            <div className="text-white font-medium">Lightning Fast</div>
            <div className="text-blue-200 text-sm">Process in seconds</div>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">📊</div>
            <div className="text-white font-medium">Smart Analysis</div>
            <div className="text-blue-200 text-sm">Intelligent insights</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center"
        >
          <p className="text-blue-300/70 text-sm font-medium">
            Crafted with ❤️ by <span className="text-blue-200 font-semibold">Ayan</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};