import React, { useState, useEffect } from 'react'; // Import useEffect
import Sidebar from '@/pages/Adminpages/Sidebar';
import AdminDashboard from '@/pages/Adminpages/AdminDashboard';
import JobMonitor from '@/pages/Adminpages/JobMonitor';
import UserManagement from '@/pages/Adminpages/UserManagement';
import SystemConfig from '@/pages/Adminpages/SystemConfig';
import { useAuth } from '@/communication/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const AdminMainLayout = () => {
  // --- UPDATED: Initialize activeTab from localStorage or default to 'dashboard' ---
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab ? savedTab : 'dashboard';
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // --- NEW: Effect to save activeTab to localStorage whenever it changes ---
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]); // This effect runs whenever activeTab state changes

  if (authLoading) {
    return <div className="p-8 text-center text-gray-600">Loading admin panel...</div>;
  }

  if (user?.role !== 'admin') {
    console.warn("Access denied. User is not an administrator.");
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    // Optionally, clear the activeTab from localStorage on logout
    localStorage.removeItem('adminActiveTab');
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'jobs':
        return <JobMonitor />;
      case 'users':
        return <UserManagement />;
      case 'config':
        return <SystemConfig />;
      default:
        // Fallback in case of an invalid tab in localStorage
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile-only Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar component - now receives logout function */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout} // Pass logout function to Sidebar for mobile logout button
      />

      {/* Main content area - takes full width on desktop as sidebar is hidden */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Unified Header for both Mobile and Desktop */}
        <header className="flex items-center justify-between bg-white p-4 border-b h-16 shadow-sm">
          {/* Left Section: Mobile Hamburger Button / Desktop "FileTools Admin Panel" name */}
          <div className="flex items-center">
            {/* Mobile-only Hamburger button to open the sidebar */}
            <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden">
              <Menu size={24} />
            </button>
            {/* Desktop-only "FileTools Admin Panel" name/logo */}
            <div className="ml-4 hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Menu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FileTools</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Center Section: Mobile "Admin Panel" Title / Desktop Navigation Links */}
          <div className="flex-1 flex items-center justify-center">
            {/* Mobile-only "Admin Panel" Title, centered */}
            <h1 className="text-xl font-bold text-gray-900 md:hidden">Admin Panel</h1>

            {/* Desktop-only Navigation Links */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === 'jobs' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Job Monitor
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === 'users' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === 'config' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                System Config
              </button>
            </nav>
          </div>

          {/* Right Section of Header: Desktop-only Logout Button (text-only) */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content area for rendering selected components */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminMainLayout;