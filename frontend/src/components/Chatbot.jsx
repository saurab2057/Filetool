import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import apiClient from '@/communication/api';

import {
  MessageCircle,
  Send,
  X,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Search,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';


const HelpChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to FileTools Support! I\'m your AI assistant powered by Hugging Face. How can I help you today? You can also search for help articles above.',
      timestamp: new Date(),
      suggestions: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const messagesEndRef = useRef(null);

  // suggestedArticles data structure - Icons are now REMOVED from here
  const suggestedArticles = [
    {
      // icon: Download, <-- Removed
      title: 'How can I download all files at once?',
      description: 'Learn how to use the bulk download feature',
      keywords: ['bulk', 'download-all', 'zip', 'archive'],
      content: `FileTools offers a convenient bulk download feature.
To download multiple files at once:
1. Select the files you wish to download by checking the boxes next to them.
2. Click the "Download Selected" button.
3. The files will be compressed into a single ZIP archive and downloaded to your device.
This is the easiest way to manage many files efficiently.`
    },
    {
      // icon: Shield, <-- Removed
      title: 'How secure are my files?',
      description: 'Understanding our security measures',
      keywords: ['security', 'privacy', 'encryption', 'safe'],
      content: `Your file security is our top priority.
We use industry-standard encryption protocols to protect your files during upload, storage, and download. Access to your files is strictly controlled. We do not share your files or data with third parties without your explicit consent, except where required by law. For detailed information, please refer to our Privacy Policy.`
    },
    {
      // icon: Clock, <-- Removed
      title: 'What is a conversion minute?',
      description: 'Learn about our pricing model',
      keywords: ['pricing', 'conversion', 'minute', 'billing'],
      content: `A conversion minute is a unit used in our pricing model to measure the processing time required for file conversions.
For example, converting a large video file might consume more conversion minutes than converting a small document. Your subscription plan includes a certain number of conversion minutes per billing cycle. You can check your usage and remaining minutes in your account dashboard.`
    },
    {
      // icon: FileText, <-- Removed
      title: 'Supported file formats',
      description: 'Complete list of supported formats',
      keywords: ['formats', 'support', 'types', 'convert'],
      content: `FileTools supports a wide range of file formats for conversion and manipulation.
These include common document types (PDF, DOCX, XLSX, PPTX, TXT), image formats (JPG, PNG, GIF, SVG), video formats (MP4, AVI, MOV), audio formats (MP3, WAV), and archive formats (ZIP, RAR). Please check our documentation for a comprehensive and up-to-date list.`
    }
  ];

  useEffect(() => {
    checkApiStatus();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkApiStatus = async () => {
    if (!navigator.onLine) {
      setApiStatus('error');
      return;
    }

    try {
      await apiClient.post('/api/chat', { message: "status check" }, { timeout: 30000 });
      setApiStatus('connected');
    } catch (error) {
      console.error('Backend status check failed:', error);
      setApiStatus('error');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!selectedArticle && !searchQuery) {
      scrollToBottom();
    }
  }, [messages, selectedArticle, searchQuery]);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setSelectedArticle(null);
    if (searchQuery) {
      setSearchQuery('');
    }

    setConversationHistory(prev => [...prev, { role: 'user', content: messageText }]);

    try {
      const response = await apiClient.post('/api/chat', { message: messageText });
      const botReplyContent = response.data?.reply || 'Received an empty reply.';

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botReplyContent,
        timestamp: new Date(),
        suggestions: null,
        error: false
      };

      setMessages(prev => [...prev, botMessage]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botReplyContent }]);

    } catch (error) {
      console.error("Error sending message to backend:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I apologize, but I'm having trouble processing your request right now.${!isOnline ? ' You appear to be offline.' : apiStatus === 'error' ? ' The AI service might be unavailable.' : ''} Please try again or contact our support team for immediate assistance.`,
        timestamp: new Date(),
        suggestions: ['Try again later', 'Check FAQ', 'Contact Support Team'],
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === 'Check FAQ') {
      setSearchQuery('');
      setSelectedArticle(null);
    } else {
      handleSendMessage(suggestion);
    }
    if (selectedArticle) {
      setSelectedArticle(null);
    }
    if (searchQuery && suggestion !== 'Check FAQ') {
      setSearchQuery('');
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setSearchQuery('');
  };

  const handleBackToChat = () => {
    setSelectedArticle(null);
    setSearchQuery('');
  };

  const handleFeedback = (messageId, isHelpful) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, feedback: isHelpful ? 'helpful' : 'not-helpful' }
        : msg
    ));
    console.log(`Feedback for message ${messageId}: ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  const filteredArticles = suggestedArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-red-500" />;

    switch (apiStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4  text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';

    switch (apiStatus) {
      case 'connected':
        return 'Active';
      case 'error':
        return 'Closed';
      default:
        return 'Connecting...';
    }
  };

  const renderContent = () => {
    if (selectedArticle) {
      // --- Article View ---
      return (
        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={handleBackToChat}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Chat
          </button>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedArticle.title}</h4>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {selectedArticle.content}
          </div>
        </div>
      );
    } else if (searchQuery) {
      // --- Search Results View ---
      return (
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Suggested Articles
          </h4>
          <div className="space-y-2">
            {filteredArticles.map((article, index) => (
              <button
                key={index}
                onClick={() => handleArticleClick(article)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  {/* No icon rendering here */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {article.title}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {article.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {filteredArticles.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                No articles found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      );
    } else {
      // --- Chat Messages View ---
      return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl ${message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : message.error
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-bl-md border border-red-200 dark:border-red-800'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
                    } transition-colors duration-300`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>

                {/* Suggestions - Only render if present in the message object */}
                {message.suggestions && message.suggestions.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left p-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* Feedback for bot messages */}
                {message.type === 'bot' && message.id !== 1 && !message.error && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className={`p-1 rounded ${message.feedback === 'helpful'
                          ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        } transition-colors duration-200`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className={`p-1 rounded ${message.feedback === 'not-helpful'
                          ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        } transition-colors duration-200`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md p-3 transition-colors duration-300">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      );
    }
  };


  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label='Open Chat'
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    // MODIFIED: This container is now full-screen on mobile and a widget on larger screens (sm and up)
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl border-gray-200 dark:border-gray-700 sm:border flex flex-col z-50 transition-colors duration-300">
      {/* Header */}
      {/* MODIFIED: Header corners are only rounded on larger screens */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 sm:rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-semibold">Hi,</h3>
          <p className="text-sm text-emerald-100">How can we help?</p>
          <div className="mt-1">
            <div className="flex items-center space-x-2 text-sm text-emerald-100">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar - Hide if viewing an article */}
      {!selectedArticle && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for Articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
            />
          </div>
        </div>
      )}


      {/* Content Area - Render based on state (article, search, or chat) */}
      <div className="flex-1 flex flex-col min-h-0">
        {renderContent()}
      </div>


      {/* Input Area - Only show input in chat view */}
      {!selectedArticle && !searchQuery && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isOnline ? "Ask me anything..." : "You're offline"}
              disabled={!isOnline || apiStatus === 'error'}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || !isOnline || apiStatus === 'error'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Contact Support button always shown at the bottom */}
      <div className="mt-auto p-3 text-center border-t border-gray-200 dark:border-gray-700">
        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          Contact Support Team
        </button>
      </div>
    </div>
  );
};

export default HelpChatbot;
