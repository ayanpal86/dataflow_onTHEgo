import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { ProcessingOptions } from './components/ProcessingOptions';
import { ProcessingResults } from './components/ProcessingResults';
import { FileParser } from './utils/fileParser';
import { DataProcessor } from './utils/dataProcessor';
import { FileData, ProcessingOptions as ProcessingOptionsType, DataRow } from './types/data';

type AppState = 'upload' | 'preview' | 'options' | 'results';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [processedData, setProcessedData] = useState<DataRow[]>([]);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    try {
      const data = await FileParser.parseFile(file);
      const processor = new DataProcessor(data);
      const analysis = processor.analyzeData();
      
      const newFileData: FileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data,
        analysis
      };
      
      setFileData(newFileData);
      setState('preview');
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToOptions = () => {
    setState('options');
  };

  const handleBackToPreview = () => {
    setState('preview');
  };

  const handleProcess = async (options: ProcessingOptionsType) => {
    if (!fileData) return;
    
    setLoading(true);
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const processor = new DataProcessor(fileData.data);
      const processed = processor.processData(options);
      setProcessedData(processed);
      setState('results');
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setFileData(null);
    setProcessedData([]);
    setState('upload');
  };

  const renderCurrentState = () => {
    switch (state) {
      case 'upload':
        return <FileUpload onFileSelect={handleFileSelect} loading={loading} />;
      
      case 'preview':
        return fileData ? (
          <DataPreview 
            fileData={fileData} 
            onProceed={handleProceedToOptions} 
          />
        ) : null;
      
      case 'options':
        return fileData ? (
          <ProcessingOptions 
            fileData={fileData} 
            onProcess={handleProcess}
            onBack={handleBackToPreview}
            loading={loading}
          />
        ) : null;
      
      case 'results':
        return fileData && processedData.length > 0 ? (
          <ProcessingResults
            originalData={fileData.data}
            processedData={processedData}
            originalAnalysis={fileData.analysis}
            processedAnalysis={new DataProcessor(processedData).analyzeData()}
            fileName={fileData.name}
            onStartOver={handleStartOver}
          />
        ) : null;
      
      default:
        return <FileUpload onFileSelect={handleFileSelect} loading={loading} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentState()}
    </div>
  );
}

export default App;