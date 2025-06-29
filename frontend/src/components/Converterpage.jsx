import React, { useState } from 'react';
import { Download, Settings, ArrowRight, FileText, Loader, CheckCircle } from 'lucide-react';
import FileUploader from '@/components/FileUploader';


const ConverterPage = ({ fromFormat, toFormat, title, description }) => {
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);

  const handleFilesSelected = (fileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: file.size,
      status: 'ready'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const startConversion = () => {
    setIsConverting(true);
    // Simulate conversion process
    setTimeout(() => {
      setFiles(files.map(file => ({ ...file, status: 'completed' })));
      setIsConverting(false);
      setConversionComplete(true);
    }, 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 mb-8">{description}</p>
          
          {/* Format Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
              {fromFormat.toUpperCase()}
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
              {toFormat.toUpperCase()}
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <FileUploader
          acceptedFormats={[fromFormat]}
          title="Choose Files"
          subtitle={`Drop your ${fromFormat.toUpperCase()} files here or click to browse`}
          maxFileSize="100MB"
          onFilesSelected={handleFilesSelected}
          className="mb-8"
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Files to Convert ({files.length})
              </h3>
              
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {file.status === 'ready' && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                      {file.status === 'converting' && (
                        <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                      )}
                      {file.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversion Settings */}
        {files.length > 0 && !conversionComplete && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Conversion Settings</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>High (Recommended)</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Mode
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Auto</option>
                    <option>RGB</option>
                    <option>CMYK</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Convert Button */}
        {files.length > 0 && !conversionComplete && (
          <div className="text-center">
            <button
              onClick={startConversion}
              disabled={isConverting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              {isConverting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  <span>Convert Files</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Download All Button */}
        {conversionComplete && (
          <div className="text-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <Download className="w-5 h-5" />
              <span>Download All Files</span>
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            About {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} Conversion
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Why Convert?</h4>
              <p className="text-gray-600 text-sm">
                Converting {fromFormat.toUpperCase()} to {toFormat.toUpperCase()} allows for better compatibility, 
                smaller file sizes, or specific use cases depending on your needs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• High-quality conversion</li>
                <li>• Batch processing</li>
                <li>• Secure file handling</li>
                <li>• Fast processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConverterPage;