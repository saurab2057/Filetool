import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Folder, Cloud, Link, HardDrive, Database } from 'lucide-react';

const FileUploader = ({ 
  acceptedFormats = [], 
  title = "Choose Files",
  subtitle = "Easily convert files from one format to another, online.",
  maxFileSize = "1GB",
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
      name: 'From Url',
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
        <p className="text-xl text-gray-600">{subtitle}</p>
      </div>

      {/* Main Upload Area */}
      <div className="relative">
        <div 
          className={`bg-gray-50 rounded-lg border-2 border-dashed transition-all duration-300 min-h-[400px] p-12 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
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
          
          {/* Center Content - Perfectly centered */}
          <div className="h-full flex flex-col items-center justify-center text-center">
            {/* Dropdown Button */}
            <div className="relative mb-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center space-x-3 min-w-[200px] justify-center"
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-blue-600 rounded-lg shadow-lg z-50 overflow-hidden">
                  {uploadSources.map((source, index) => (
                    <button
                      key={source.id}
                      onClick={() => handleSourceSelect(source.id)}
                      className={`w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-blue-700 transition-colors duration-200 text-white ${
                        index < uploadSources.length - 1 ? 'border-b border-blue-500' : ''
                      }`}
                    >
                      <source.icon className={`w-5 h-5 ${source.color}`} />
                      <span className="font-medium">{source.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* File size and terms info - INSIDE the upload box, centered */}
            <div className="space-y-2">
              <p className="text-gray-500">
                Max file size {maxFileSize}. <a href="#" className="text-blue-600 hover:underline">Sign Up</a> for more
              </p>
              <p className="text-sm text-gray-400">
                By proceeding, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Use</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Convert Any File</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            FreeConvert supports more than 1500 file conversions. You can convert videos, images, audio files, or e-books. There are tons of Advanced Options to fine-tune your conversions.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Works Anywhere</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            FreeConvert is an online file converter. So it works on Windows, Mac, Linux, or any mobile device. All major browsers are supported. Simply upload a file and select a target format.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy Guaranteed</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We know that file security and privacy are important to you. That is why we use 256-bit SSL encryption when transferring files and automatically delete them after a few hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;