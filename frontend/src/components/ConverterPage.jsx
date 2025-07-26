import React, { useState, useMemo } from 'react';
import apiClient from '@/communication/api'; // Make sure this path is correct
import { useLocation } from 'react-router-dom';
import { Settings, FileText, Loader, CheckCircle, AlertCircle, XCircle } from 'lucide-react'; // Added XCircle for the clear button icon
import FileUploader from '@/components/FileUploader'; // Adjust the import path as necessary
const MAX_ALLOWED_FILES = 5; // Define a constant for the max file limit

const ConverterPage = ({ fromFormat, toFormat, title, description, settingsComponent: SettingsComponent, defaultSettings }) => {

  const location = useLocation();

  const [files, setFiles] = useState(location.state?.initialFiles || []);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [editingFileId, setEditingFileId] = useState(null);
  const [uploadLimitExceeded, setUploadLimitExceeded] = useState(false); // New state for upload limit feedback

  // --- CHANGED: This function is updated to correctly match results ---
  const startConversion = async () => {
    setIsConverting(true);
    setFiles(prev => prev.map(f => (f.status === 'ready' ? { ...f, status: 'converting' } : f)));

    // This ensures we only send files that are actually ready to be converted
    const filesToProcess = files.filter(f => f.status === 'ready');
    if (filesToProcess.length === 0) {
        setIsConverting(false);
        return; // Nothing to convert
    }

    try {
      const formData = new FormData();

      const settingsPayload = filesToProcess.map(file => ({
        originalName: file.name,
        settings: file.settings
      }));

      filesToProcess.forEach(file => {
        formData.append('files', file.file, file.name);
      });

      formData.append('settings', JSON.stringify(settingsPayload));
      formData.append('toFormat', toFormat);

      const response = await apiClient.post('/api/convert/batch', formData);
      const results = response.data;

      // This is the new, robust matching logic. It relies on the order of files,
      // which is not affected by special characters in filenames.
      setFiles(prevFiles => {
          const processedFiles = [...prevFiles];
          let resultIndex = 0;

          processedFiles.forEach((file, index) => {
              if (file.status === 'converting') {
                  const result = results[resultIndex];
                  if (result) {
                      processedFiles[index] = {
                          ...file,
                          status: result.success ? 'completed' : 'error',
                          downloadUrl: result.downloadUrl || null,
                          errorMessage: result.message || null,
                      };
                  } else {
                      processedFiles[index] = { ...file, status: 'error', errorMessage: 'No result from server for this file.' }; // More specific message
                  }
                  resultIndex++;
              }
          });
          return processedFiles;
      });

    } catch (error) {
      console.error('An error occurred during the batch conversion request:', error);
      // Enhanced error message extraction
      let errorMessage = 'An unknown server error occurred.';
      if (error.response) {
          if (error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
          } else if (error.response.status) {
              errorMessage = `Server responded with status: ${error.response.status}`;
          }
      } else if (error.request) {
          errorMessage = 'No response received from server. Please check your network connection.';
      } else {
          errorMessage = error.message || 'An unexpected error occurred.';
      }

      setFiles(prev => prev.map(f => (f.status === 'converting' ? { ...f, status: 'error', errorMessage } : f)));
    }

    setIsConverting(false);
    setConversionComplete(true);
  };

  // --- NEW: Function to reset the UI after a conversion is complete ---
  const handleStartOver = () => {
    setFiles([]);
    setConversionComplete(false);
    setIsConverting(false);
    setUploadLimitExceeded(false); // Reset upload limit feedback
  };

  const handleSaveSettings = (fileId, newSettings) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === fileId ? { ...file, settings: newSettings } : file
      )
    );
  };

  // --- CHANGED: This now resets the UI if you add new files and enforces limit ---
  const handleFilesSelected = (fileList) => {
    const currentFileCount = files.length;
    const filesToAdd = Array.from(fileList);
    const availableSlots = MAX_ALLOWED_FILES - currentFileCount;

    if (filesToAdd.length > availableSlots) {
      setUploadLimitExceeded(true);
      // Optionally, show a temporary message or prevent adding any files
      // For now, we'll only add up to the limit
      const limitedFiles = filesToAdd.slice(0, availableSlots);
      const newFiles = limitedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file: file,
        name: file.name,
        size: file.size,
        status: 'ready',
        settings: { ...defaultSettings } || {}
      }));
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      setUploadLimitExceeded(false);
      const newFiles = filesToAdd.map((file) => ({
        id: crypto.randomUUID(),
        file: file,
        name: file.name,
        size: file.size,
        status: 'ready',
        settings: { ...defaultSettings } || {}
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }

    // This allows the "Convert" button to reappear when new files are added.
    setConversionComplete(false);
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
    setUploadLimitExceeded(false); // Reset limit feedback if files are removed
  };

  const formatFileSize = useMemo(() => (bytes) => { // Memoized for slight optimization
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const fileToEdit = files.find(f => f.id === editingFileId);

  // New calculated values for batch progress display
  const totalFilesToConvert = files.length;
  const completedOrErrorFiles = files.filter(f => f.status === 'completed' || f.status === 'error').length;
  const convertingFiles = files.filter(f => f.status === 'converting').length;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {SettingsComponent && (
        <SettingsComponent
          isOpen={!!editingFileId}
          onClose={() => setEditingFileId(null)}
          file={fileToEdit}
          onSave={handleSaveSettings}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">{description}</p>
        </div>

        <FileUploader
          acceptedFormats={[fromFormat]}
          title="Add More Files"
          subtitle={`Drop your ${fromFormat.toUpperCase()} files here or click to browse (Max ${MAX_ALLOWED_FILES} files)`}
          maxFileSize="100MB" // This is client-side text, backend should enforce actual limit
          onFilesSelected={handleFilesSelected}
          className="mb-8"
        />

        {uploadLimitExceeded && (
          <p className="text-red-500 dark:text-red-400 text-center mb-4">
            You can only upload a maximum of {MAX_ALLOWED_FILES} files. Some files might not have been added.
          </p>
        )}

        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Files to Convert ({files.length})</h3>

              {isConverting && ( // New batch progress indicator
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                  Processing {completedOrErrorFiles} of {totalFilesToConvert} files...
                </p>
              )}

              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shrink-0">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {file.status === 'ready' && (
                        <>
                          <button onClick={() => setEditingFileId(file.id)} className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40" aria-label="Settings">
                            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button onClick={() => removeFile(file.id)} className="text-red-600 dark:text-red-400 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                            Remove
                          </button>
                        </>
                      )}
                      {file.status === 'converting' && (
                        <div className="flex items-center space-x-2">
                          <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                          <span className="text-sm text-blue-600 dark:text-blue-400">Converting...</span>
                        </div>
                      )}
                      {file.status === 'completed' && (
                        <>
                          <a
                            href={file.downloadUrl}
                            download
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
                          >
                            {/* Download icon removed as requested */}
                            <span>Download</span>
                          </a>
                          {/* New Clear button for completed files */}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 ml-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Clear</span>
                          </button>
                        </>
                      )}
                      {file.status === 'error' && (
                        <>
                          <div className="flex items-center space-x-2 text-red-500" title={file.errorMessage}>
                            <AlertCircle className="w-5 h-5" />
                            <span>Error</span>
                          </div>
                          {/* New Clear button for error files */}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 ml-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Clear</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {files.length > 0 && !conversionComplete && (
          <div className="text-center mb-8">
            <button onClick={startConversion} disabled={isConverting} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none">
              {isConverting ? ( <> <Loader className="w-5 h-5 animate-spin" /> <span>Converting Files...</span> </> ) : ( <span>Convert {files.length} File{files.length > 1 ? 's' : ''}</span> )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterPage;