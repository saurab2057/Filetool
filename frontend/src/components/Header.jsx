import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserPlus, RefreshCw, Archive, ChevronDown, ChevronRight, Video, Music, Image, FileText, Globe, Calculator, X } from 'lucide-react';

const Header = () => {
  const [isConvertDropdownOpen, setIsConvertDropdownOpen] = useState(false);
  const [isCompressDropdownOpen, setIsCompressDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileConvertOpen, setMobileConvertOpen] = useState(false);
  const [mobileCompressOpen, setMobileCompressOpen] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);
  const [mobileImageOpen, setMobileImageOpen] = useState(false);
  const [mobilePdfOpen, setMobilePdfOpen] = useState(false);
  const [mobileGifOpen, setMobileGifOpen] = useState(false);
  const [mobileOthersOpen, setMobileOthersOpen] = useState(false);
  
  // New states for compress nested menus
  const [mobileCompressVideoOpen, setMobileCompressVideoOpen] = useState(false);
  const [mobileCompressImageOpen, setMobileCompressImageOpen] = useState(false);
  const [mobileCompressPdfOpen, setMobileCompressPdfOpen] = useState(false);
  const [mobileCompressGifOpen, setMobileCompressGifOpen] = useState(false);

  const toggleConvertDropdown = () => {
    setIsConvertDropdownOpen(!isConvertDropdownOpen);
    setIsCompressDropdownOpen(false);
  };

  const toggleCompressDropdown = () => {
    setIsCompressDropdownOpen(!isCompressDropdownOpen);
    setIsConvertDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Reset all mobile submenu states when closing
    if (isMobileMenuOpen) {
      setMobileConvertOpen(false);
      setMobileCompressOpen(false);
      setMobileVideoOpen(false);
      setMobileImageOpen(false);
      setMobilePdfOpen(false);
      setMobileGifOpen(false);
      setMobileOthersOpen(false);
      setMobileCompressVideoOpen(false);
      setMobileCompressImageOpen(false);
      setMobileCompressPdfOpen(false);
      setMobileCompressGifOpen(false);
    }
  };

  const toggleMobileConvert = () => {
    setMobileConvertOpen(!mobileConvertOpen);
    setMobileCompressOpen(false);
    // Reset compress submenus when switching to convert
    setMobileCompressVideoOpen(false);
    setMobileCompressImageOpen(false);
    setMobileCompressPdfOpen(false);
    setMobileCompressGifOpen(false);
  };

  const toggleMobileCompress = () => {
    setMobileCompressOpen(!mobileCompressOpen);
    setMobileConvertOpen(false);
    // Reset convert submenus when switching to compress
    setMobileVideoOpen(false);
    setMobileImageOpen(false);
    setMobilePdfOpen(false);
    setMobileGifOpen(false);
    setMobileOthersOpen(false);
  };

  const convertCategories = [
    {
      icon: Video,
      title: "Video & Audio",
      color: "text-blue-400",
      items: [
        { name: "MP3 to WAV", path: "#" },
        { name: "Video to MP3", path: "#" },
        { name: "Video to AAC", path: "#" },
        { name: "MP4 to MP3", path: "/mp4-to-mp3" },
        { name: "MOV to MP4", path: "#" },
        { name: "MP4 to WebM", path: "#" },
        { name: "MKV to MP4", path: "#" }
      ]
    },
    {
      icon: Image,
      title: "Image",
      color: "text-purple-400",
      items: [
        { name: "WEBP to PNG", path: "#" },
        { name: "JFIF to PNG", path: "#" },
        { name: "PNG to SVG", path: "/png-to-svg" },
        { name: "WEBP to JPG", path: "#" },
      ]
    },
    {
      icon: FileText,
      title: "PDF & Documents",
      color: "text-red-400",
      items: [
        { name: "PDF Converter", path: "#" },
        { name: "Document Converter", path: "#" },
        { name: "PDF to Word", path: "#" },
        { name: "PDF to JPG", path: "#" },
        { name: "EPUB to PDF", path: "#" },
        { name: "JPG to PDF", path: "#" }
      ]
    },
    {
      icon: Image,
      title: "GIF",
      color: "text-green-400",
      items: [
        { name: "Video to GIF", path: "#" },
        { name: "MP4 to GIF", path: "#" },
        { name: "WEBM to GIF", path: "#" },
        { name: "GIF to MP4", path: "#" },
        { name: "GIF to APNG", path: "#" },
      ]
    },
    {
      icon: Calculator,
      title: "Others",
      color: "text-orange-400",
      items: [
        { name: "Unit Converter", path: "#" },
        { name: "Time Converter", path: "#" },
        { name: "Archive Converter", path: "#" }
      ]
    }
  ];

  const compressCategories = [
    {
      icon: Video,
      title: "Video & Audio",
      color: "text-blue-400",
      items: [
        { name: "Video Compressor", path: "#" },
        { name: "MP3 Compressor", path: "#" },
        { name: "WAV Compressor", path: "#" }
      ]
    },
    {
      icon: Image,
      title: "Image",
      color: "text-purple-400",
      items: [
        { name: "Image Compressor", path: "#" },
        { name: "JPEG Compressor", path: "#" },
        { name: "PNG Compressor", path: "#" }
      ]
    },
    {
      icon: Image,
      title: "GIF",
      color: "text-green-400",
      items: [
        { name: "GIF Compressor", path: "#" }
      ]
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              FileTools
            </Link>
          </div>

          {/* Navigation Links - Desktop Only */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative">
              <button 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                onClick={toggleConvertDropdown}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Convert</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isConvertDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Convert Dropdown */}
              {isConvertDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-screen max-w-5xl bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  style={{ left: '-200px' }}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-5 gap-6">
                      {convertCategories.map((category, index) => (
                        <div key={index}>
                          <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                            <category.icon className={`w-4 h-4 ${category.color}`} />
                            <span>{category.title}</span>
                          </h3>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link 
                                  to={item.path} 
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                  onClick={() => setIsConvertDropdownOpen(false)}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                onClick={toggleCompressDropdown}
              >
                <Archive className="w-4 h-4" />
                <span>Compress</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCompressDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Compress Dropdown */}
              {isCompressDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-screen max-w-4xl bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  style={{ left: '-200px' }}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-6">
                      {compressCategories.map((category, index) => (
                        <div key={index}>
                          <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                            <category.icon className={`w-4 h-4 ${category.color}`} />
                            <span>{category.title}</span>
                          </h3>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link 
                                  to={item.path} 
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                  onClick={() => setIsCompressDropdownOpen(false)}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Auth Buttons - Desktop Only */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50">
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-700 hover:text-gray-900 p-2 rounded-md transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white absolute left-0 right-0 top-full z-50 shadow-lg">
            <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
              
              {/* Convert Section */}
              <div>
                <button 
                  className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                  onClick={toggleMobileConvert}
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Convert</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileConvertOpen ? 'rotate-90' : ''}`} />
                </button>
                
                {mobileConvertOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {convertCategories.map((category, index) => (
                      <div key={index}>
                        <button 
                          className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-gray-50"
                          onClick={() => {
                            if (category.title === "Video & Audio") setMobileVideoOpen(!mobileVideoOpen);
                            if (category.title === "Image") setMobileImageOpen(!mobileImageOpen);
                            if (category.title === "PDF & Documents") setMobilePdfOpen(!mobilePdfOpen);
                            if (category.title === "GIF") setMobileGifOpen(!mobileGifOpen);
                            if (category.title === "Others") setMobileOthersOpen(!mobileOthersOpen);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <category.icon className={`w-4 h-4 ${category.color}`} />
                            <span>{category.title}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${
                            (category.title === "Video & Audio" && mobileVideoOpen) ||
                            (category.title === "Image" && mobileImageOpen) ||
                            (category.title === "PDF & Documents" && mobilePdfOpen) ||
                            (category.title === "GIF" && mobileGifOpen) ||
                            (category.title === "Others" && mobileOthersOpen)
                            ? 'rotate-90' : ''
                          }`} />
                        </button>
                        
                        {((category.title === "Video & Audio" && mobileVideoOpen) ||
                          (category.title === "Image" && mobileImageOpen) ||
                          (category.title === "PDF & Documents" && mobilePdfOpen) ||
                          (category.title === "GIF" && mobileGifOpen) ||
                          (category.title === "Others" && mobileOthersOpen)) && (
                          <div className="ml-6 mt-1 space-y-1">
                            {category.items.map((item, itemIndex) => (
                              <Link 
                                key={itemIndex}
                                to={item.path} 
                                className="block text-sm text-gray-500 hover:text-blue-600 px-3 py-1 rounded transition-colors duration-200"
                                onClick={toggleMobileMenu}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compress Section */}
              <div>
                <button 
                  className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                  onClick={toggleMobileCompress}
                >
                  <div className="flex items-center space-x-2">
                    <Archive className="w-4 h-4" />
                    <span>Compress</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileCompressOpen ? 'rotate-90' : ''}`} />
                </button>
                
                {mobileCompressOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {compressCategories.map((category, index) => (
                      <div key={index}>
                        <button 
                          className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-gray-50"
                          onClick={() => {
                            if (category.title === "Video & Audio") setMobileCompressVideoOpen(!mobileCompressVideoOpen);
                            if (category.title === "Image") setMobileCompressImageOpen(!mobileCompressImageOpen);
                            if (category.title === "PDF & Documents") setMobileCompressPdfOpen(!mobileCompressPdfOpen);
                            if (category.title === "GIF") setMobileCompressGifOpen(!mobileCompressGifOpen);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <category.icon className={`w-4 h-4 ${category.color}`} />
                            <span>{category.title}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${
                            (category.title === "Video & Audio" && mobileCompressVideoOpen) ||
                            (category.title === "Image" && mobileCompressImageOpen) ||
                            (category.title === "PDF & Documents" && mobileCompressPdfOpen) ||
                            (category.title === "GIF" && mobileCompressGifOpen)
                            ? 'rotate-90' : ''
                          }`} />
                        </button>
                        
                        {((category.title === "Video & Audio" && mobileCompressVideoOpen) ||
                          (category.title === "Image" && mobileCompressImageOpen) ||
                          (category.title === "PDF & Documents" && mobileCompressPdfOpen) ||
                          (category.title === "GIF" && mobileCompressGifOpen)) && (
                          <div className="ml-6 mt-1 space-y-1">
                            {category.items.map((item, itemIndex) => (
                              <Link 
                                key={itemIndex}
                                to={item.path} 
                                className="block text-sm text-gray-500 hover:text-blue-600 px-3 py-1 rounded transition-colors duration-200"
                                onClick={toggleMobileMenu}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth Buttons */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium w-full text-left transition-colors duration-200 hover:bg-gray-50">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium w-full text-left transition-colors duration-200">
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;