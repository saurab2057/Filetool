import React, { useState, useEffect } from 'react';
import { Settings, X, RefreshCw } from 'lucide-react';

// Export the defaults so the page can import and use them.
export const defaultImageSettings = {
  quality: 90,
  dithering: true,
};

// This is the main component passed to ConverterPage.
// It NO LONGER needs setFiles or the problematic useEffect.
const PNGSetting = ({ isOpen, onClose, file, onSave }) => {
  return (
    <ImageSettingsModal 
        isOpen={isOpen}
        onClose={onClose}
        file={file}
        onSave={onSave}
    />
  );
};

// The modal for Image settings.
const ImageSettingsModal = ({ file, isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState(defaultImageSettings);

  useEffect(() => {
    if (file && file.settings) {
      setSettings(file.settings);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = { ...settings, [name]: type === 'checkbox' ? (name === 'quality' ? parseInt(value) : checked) : value };
    setSettings(newSettings);
  };

  const handleReset = () => setSettings(defaultImageSettings);
  const handleApply = () => { onSave(file.id, settings); onClose(); };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-900 dark:text-white" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Image Options</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="px-1 pt-1 text-sm text-gray-600 dark:text-gray-400 truncate">File: <span className="font-medium">{file.name}</span></p>
          <div>
            <label htmlFor="quality" className="font-medium text-gray-700 dark:text-gray-300">Quality: {settings.quality}%</label>
            <input id="quality" name="quality" type="range" min="0" max="100" value={settings.quality} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"/>
          </div>
          <div className="flex items-center">
            <input id="dithering" name="dithering" type="checkbox" checked={settings.dithering} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
            <label htmlFor="dithering" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Enable Dithering</label>
          </div>
        </div>
        <div className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleReset} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            <RefreshCw className="w-4 h-4"/>
            <span>Reset</span>
          </button>
          <button onClick={handleApply} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md">
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PNGSetting;