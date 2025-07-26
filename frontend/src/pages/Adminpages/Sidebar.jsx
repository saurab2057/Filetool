import React from 'react';
import { BarChart3, Activity, Users, Settings, X } from 'lucide-react'; // Import X for close button

// --- UPDATED: Sidebar now accepts handleLogout prop ---
const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setSidebarOpen, handleLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'jobs', label: 'Job Monitor', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    // Auto-hide the sidebar after selection on mobile for smooth UX
    // Added a small delay to allow state update to render if needed
    if (window.innerWidth < 768) { // Check for mobile explicitly or use your md breakpoint
      setTimeout(() => {
        setSidebarOpen(false);
      }, 150);
    }
  };

  return (
    // --- UPDATED: Root div has 'md:hidden' to hide on desktop ---
    <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out 
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:hidden`}
    >
      {/* Header section with "FileTools Admin Panel" and Close button */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FileTools</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
        {/* --- NEW: Close button for mobile sidebar --- */}
        <button onClick={() => setSidebarOpen(false)} className="p-2 md:hidden">
          <X size={24} />
        </button>
      </div>
      
      <nav className="p-4 flex-1"> {/* flex-1 to push logout to bottom */}
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* --- NEW: Logout button for mobile, inside the sidebar --- */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 hover:text-red-800 font-medium"
        >
          <BarChart3 className="w-5 h-5" /> {/* Using BarChart3 as a placeholder icon, you might want LogOut from lucide-react here */}
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;