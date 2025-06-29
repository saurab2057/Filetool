import React from 'react';
import { Video, Music, Image, FileText, Archive, Calculator, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Video Converter */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4">
              <Video className="w-5 h-5 text-blue-400" />
              <span>Video Converter</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">MP4 Converter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">MOV to MP4</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Video to GIF</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Video to MP3</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">MP4 to MP3</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Video Converter</a></li>
            </ul>
          </div>

          {/* Audio Converter */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4">
              <Music className="w-5 h-5 text-green-400" />
              <span>Audio Converter</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">MP3 Converter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Audio Converter</a></li>
            </ul>
          </div>

          {/* Image Converter */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4">
              <Image className="w-5 h-5 text-purple-400" />
              <span>Image Converter</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Image Converter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">JPG to PDF</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Image to PDF</a></li>
            </ul>
          </div>

          {/* Web Tools */}
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Web Tools</span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Collage Maker</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Image Resizer</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Crop Image</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Color Picker</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700 pt-8">
          {/* Links in List Format */}
          <div className="text-center mb-6">
            <ul className="flex flex-wrap justify-center space-x-6 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Donate</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Terms</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Security and Compliance</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Status</a></li>
            </ul>
          </div>

          {/* Copyright with Brand Name */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              FileTools © FileTools.com v2.30 All rights reserved (2025)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;