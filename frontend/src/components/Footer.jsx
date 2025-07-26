import React from 'react';

const Footer = () => {
  return (
    // Set a light background for default, and dark for dark mode.
    <footer className="bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Video Converter */}
          <div>
            {/* HEADING: Dark text in light mode, light text in dark mode */}
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              <span>Video Converter</span>
            </h3>
            <ul className="space-y-2">
              {/* LINKS: Gray text in light mode, lighter gray in dark mode. Hover makes them darker/lighter */}
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">MP4 Converter</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">MOV to MP4</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Video to GIF</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Video to MP3</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">MP4 to MP3</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Video Converter</a></li>
            </ul>
          </div>

          {/* Audio Converter */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              <span>Audio Converter</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">MP3 Converter</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Audio Converter</a></li>
            </ul>
          </div>

          {/* Image Converter */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              <span>Image Converter</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Image Converter</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">JPG to PDF</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Image to PDF</a></li>
            </ul>
          </div>

          {/* Web Tools */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              <span>Web Tools</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Collage Maker</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Image Resizer</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Crop Image</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Color Picker</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        {/* BORDER: A light gray border in light mode, a darker gray in dark mode */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-8 transition-colors duration-300">
          <div className="text-center mb-6">
            <ul className="flex flex-wrap justify-center space-x-6 text-sm">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Donate</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Privacy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Terms</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Security and Compliance</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Status</a></li>
            </ul>
          </div>

          {/* Copyright with Brand Name */}
          <div className="text-center">
            {/* COPYRIGHT TEXT: Medium gray in light mode, darker gray in dark mode */}
            <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
              FileTools © FileTools.com v2.30 All rights reserved (2025)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;