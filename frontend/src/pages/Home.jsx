import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Lock, Globe, Smartphone } from 'lucide-react';
import FileUploader from '@/components/Fileuploader';
import { AnimatedStats } from '@/components/AnimatedStats'
import { AnimatedTestimonials } from '@/components/AnimatedTestimonials';

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
      description: "All data transfers are secured with industry-standard encryption"
    },
    {
      icon: Globe,
      title: "Secured Data Centers",
      description: "Your files are processed in secure, monitored data centers"
    },
    {
      icon: Lock,
      title: "Access Control and Authentication",
      description: "Multi-layered security protocols protect your data"
    }
  ];

  const handleFilesSelected = (files) => {
    console.log('Files selected:', files);
    // Handle file selection logic here
  };

  const scrollToConverter = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section id="converter" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            File Converter
          </h1>

          {/* File Upload Area */}
          <FileUploader
            title="Choose Files"
            subtitle="Easily convert files from one format to another, online."
            maxFileSize="1GB"
            onFilesSelected={handleFilesSelected}
          />
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Data, Our Priority</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                At FreeConvert, we go beyond just converting files; we protect them. Our robust security framework ensures that your data is always safe, whether you're converting an image, video, or document. With advanced encryption, secure data centers, and vigilant monitoring, we've covered every aspect of your data's safety.
              </p>

              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="text-center">
                <Lock className="w-24 h-24 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise-Grade Security</h3>
                <p className="text-gray-600 mb-6">
                  Your files are protected with the same level of security used by Fortune 500 companies.
                </p>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                    <Lock className="w-5 h-5" />
                    <span className="font-semibold">Files Auto-Deleted</span>
                  </div>
                  <p className="text-sm text-gray-600">All uploaded files are automatically deleted after 30min of processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <AnimatedStats />


      {/* Testimonials Section */}
      {/* Animated Testimonials Section */}
      <AnimatedTestimonials testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Convert Your Files?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who trust FileTools for their file conversion needs. Start converting now!
          </p>
          <button
            onClick={scrollToConverter}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
          >
            Start Now
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about FileTools</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Is FileTools free to use?",
                answer: "Yes, FileTools offers free file conversion with a 1GB file size limit. For larger files and additional features, we offer premium plans."
              },
              {
                question: "How secure are my files?",
                answer: "We use 256-bit SSL encryption for all file transfers and automatically delete files after processing. Your privacy and security are our top priorities."
              },
              {
                question: "What file formats do you support?",
                answer: "We support over 1500 file formats including videos, images, documents, audio files, and more. If you need a specific format, chances are we support it."
              },
              {
                question: "How long does conversion take?",
                answer: "Conversion time depends on file size and format. Most conversions complete within minutes. Larger files may take longer but we'll keep you updated on progress."
              },
              {
                question: "Can I convert multiple files at once?",
                answer: "Yes, our batch conversion feature allows you to convert multiple files simultaneously, saving you time and effort."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;