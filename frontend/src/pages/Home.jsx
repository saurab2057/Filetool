import React from 'react';
import { Link } from 'react-router-dom';
import {Lock, Globe, CheckCircle} from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import { AnimatedStats } from '@/components/AnimatedStats'
import { AnimatedTestimonials } from '@/components/AnimatedReview';
import { useNavigate } from 'react-router-dom';
import { defaultAudioSettings } from '@/components/AudioSetting';
import { defaultImageSettings } from '@/components/PNGSetting';
import { defaultVideoSettings } from '@/components/VideoSetting';

const HomePage = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Graphic Designer",
      content: "FileTools has been a game-changer for my workflow. Converting between different image formats is now effortless and fast.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Video Editor",
      content: "The video conversion quality is outstanding. I use it daily for converting client files to different formats.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Marketing Manager",
      content: "Perfect for our team's document conversion needs. The batch processing feature saves us hours every week.",
      rating: 5
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "SSL/TLS Encryption",
      description: "All data transfers are secured with industry-standard 256-bit encryption"
    },
    {
      icon: Globe,
      title: "Secured Data Centers",
      description: "Your files are processed in secure, monitored data centers worldwide"
    },
    {
      icon: CheckCircle,
      title: "Auto-Delete Protection",
      description: "Files are automatically deleted after 30 minutes for maximum privacy"
    }
  ];

  const navigate = useNavigate();
  const handleFilesSelected = (files) => {
    if (files.length > 0) {
      const firstFile = files[0];
      const fileName = firstFile.name.toLowerCase();

      let settingsToApply;
      let targetRoute;

      // Logic to decide which settings and route to use
      if (fileName.endsWith('.mp4')) {
        settingsToApply = defaultAudioSettings;
        targetRoute = '/mp4-to-mp3';
      } else if (fileName.endsWith('.mov')) {
        settingsToApply = defaultVideoSettings;
        targetRoute = '/mov-to-mp4';
      } else if (fileName.endsWith('.png')) {
        settingsToApply = defaultImageSettings;
        targetRoute = '/png-to-svg';
      } else {
        alert('This file type is not supported for automatic redirection.');
        return; // Stop the function here
      }

      // Now map the files and apply the *correct* default settings
      const selectedFileObjects = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        file: file,
        name: file.name,
        size: file.size,
        status: 'ready',
        settings: { ...settingsToApply } // Use the variable decided above
      }));

      navigate(targetRoute, { state: { initialFiles: selectedFileObjects } });
    }
  };



  const scrollToConverter = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section id="converter" className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 py-20 lg:py-24 transition-colors duration-300 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ddd6fe%22 fill-opacity=%220.4%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            File <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Converter</span>
          </h1>


          {/* File Upload Area */}
          <FileUploader
            title="Choose Files"
            subtitle="Easily convert files from one format to another, online."
            maxFileSize="100MB"
            onFilesSelected={handleFilesSelected}
          />
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Your Data, Our Priority</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-colors duration-300">
                At FileTools, we go beyond just converting files; we protect them. Our robust security framework ensures that your data is always safe, whether you're converting an image, video, or document.
              </p>

              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl p-8 transition-colors duration-300">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Bank-Level Security</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
                  Your files are protected with the same level of security used by Fortune 500 companies and financial institutions.
                </p>
                <div className="bg-white dark:bg-gray-600 rounded-xl p-6 shadow-lg transition-colors duration-300">
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-2 transition-colors duration-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Files Auto-Deleted</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">All uploaded files are automatically deleted after 30 minutes of processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedStats />

      {/* Testimonials Section */}
      <AnimatedTestimonials testimonials={testimonials} />

      {/* CTA Section */}
      {/* 1. Replaced the permanent gradient with a theme-aware background color */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
        {/* The decorative SVG background has been removed as it doesn't fit the light theme */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* 2. Changed heading text to be dark in light mode, white in dark mode */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Ready to Convert Your Files?</h2>

          {/* 3. Changed paragraph text to be gray in light mode, light-gray in dark mode */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
            Join millions of users who trust FileTools for their file conversion needs.
          </p>

          {/* 4. Completely restyled the button to work for both themes */}
          <button
            onClick={scrollToConverter}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-blue-700 dark:hover:bg-gray-200 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Convert Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;