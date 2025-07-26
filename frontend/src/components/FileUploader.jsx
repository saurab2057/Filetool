import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Folder, Cloud, Link, HardDrive, Database, Upload } from 'lucide-react';

const FileUploader = ({ 
  acceptedFormats = [], 
  title = "Choose Files",
  subtitle = "Easily convert files from one format to another, online.",
  maxFileSize = "100MB",
  onFilesSelected,
  className = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadSources = [
    {
      id: 'device',
      name: 'From Device',
      icon: Folder,
      color: 'text-white'
    },
    {
      id: 'dropbox',
      name: 'From Dropbox',
      icon: Database,
      color: 'text-white'
    },
    {
      id: 'googledrive',
      name: 'From Google Drive',
      icon: HardDrive,
      color: 'text-white'
    },
    {
      id: 'onedrive',
      name: 'From OneDrive',
      icon: Cloud,
      color: 'text-white'
    },
    {
      id: 'url',
      name: 'From URL',
      icon: Link,
      color: 'text-white'
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    if (onFilesSelected) {
      onFilesSelected(fileList);
    }
  };

  const handleSourceSelect = (sourceId) => {
    setIsDropdownOpen(false);
    
    if (sourceId === 'device') {
      document.getElementById('file-upload-input').click();
    } else {
      console.log(`Selected source: ${sourceId}`);
    }
  };

  const acceptString = acceptedFormats.length > 0 ? acceptedFormats.map(format => `.${format}`).join(',') : '*';

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Subtitle */}
      <div className="text-center mb-8">
        <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">{subtitle}</p>
      </div>

      {/* Main Upload Area */}
      <div className="relative">
        <div 
          className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[400px] p-12 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-102'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* File Upload Input */}
          <input
            type="file"
            multiple
            accept={acceptString}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload-input"
          />
          
          {/* Center Content */}
          <div className="h-full flex flex-col items-center justify-center text-center mt-8">
            {/* Dropdown Button */}
            <div className="relative mb-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-3 min-w-[200px] justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FileText className="w-5 h-5" />
                <span>{title}</span>
                {isDropdownOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl shadow-xl z-50 overflow-hidden border border-blue-500">
                  {uploadSources.map((source, index) => (
                    <button
                      key={source.id}
                      onClick={() => handleSourceSelect(source.id)}
                      className={`w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 text-white ${
                        index < uploadSources.length - 1 ? 'border-b border-blue-500 dark:border-blue-400' : ''
                      }`}
                    >
                      <source.icon className={`w-5 h-5 ${source.color}`} />
                      <span className="font-medium">{source.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drag and Drop Text */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                or drag and drop files here
              </p>
            </div>

            {/* File size and terms info */}
            <div className="space-y-2">
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Max file size {maxFileSize}. <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign Up</a> for more
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
                By proceeding, you agree to our <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Use</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;