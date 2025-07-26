import React, { useState } from 'react';
import apiClient from '@/communication/api';
import { Search, Filter, Crown, Users, Ban, CheckCircle, RefreshCw, MapPin, Tablet, Globe, Clock } from 'lucide-react'; // Added new icons
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


// --- Data Fetching and Updating Functions (from previous refactor, no changes needed unless API changed) ---
const fetchAllUsers = async () => {
  const { data } = await apiClient.get('/api/admin/users'); // This now returns latestMetadata
  return data;
};

const updateUserStatusApi = async ({ userId, newStatus }) => {
  const { data } = await apiClient.put(`/api/admin/users/${userId}`, { status: newStatus });
  return data;
};


const UserManagement = () => {
  const queryClient = useQueryClient();

  const {
    data: allUsers,
    isLoading,
    isError,
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  });

  const {
    mutate: mutateUserStatus,
    isLoading: isUpdatingStatus,
  } = useMutation({
    mutationFn: updateUserStatusApi,
    onSuccess: (updatedUser) => {
      // Option 1: Invalidate and refetch (simpler, ensures full consistency)
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Option 2 (Advanced/Optimistic): Manually update the cache if you want faster UI response
      // queryClient.setQueryData(['users'], (oldUsers) => {
      //   return oldUsers.map(user => user._id === updatedUser.user._id ? updatedUser.user : user);
      // });
      // If you use Option 2, the `updatedUser` object from the mutation response must contain the `latestMetadata`
      // just like the `GET /users` endpoint, which our backend modification now ensures.

      alert(`User status updated to ${updatedUser.user?.status || 'unknown'} successfully!`); // Use updatedUser.user from backend
    },
    onError: (err) => {
      console.error('Failed to update user status:', err);
      alert('Error: Could not update user status. ' + err.message);
    }
  });


  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUpdateUserStatus = (userId, newStatus) => {
    mutateUserStatus({ userId, newStatus });
  };

  const filteredUsers = (allUsers || []).filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = user.email.toLowerCase().includes(searchLower) ||
                         (user.name && user.name.toLowerCase().includes(searchLower)) ||
                         (user._id && user._id.toLowerCase().includes(searchLower));
    
    const matchesType = userTypeFilter === 'all' || user.role === userTypeFilter; // Assuming user.role is used for filter
    return matchesSearch && matchesType;
  });

  const getUserTypeBadge = (type = 'user') => {
    const config = {
      admin: { icon: Crown, color: 'text-amber-700', bg: 'bg-amber-100', label: 'Admin' },
      user: { icon: Users, color: 'text-gray-700', bg: 'bg-gray-100', label: 'User' }
    };
    const selected = config[type] || config.user;
    const Icon = selected.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${selected.bg} ${selected.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {selected.label}
      </span>
    );
  };

  const getStatusBadge = (status = 'active') => {
    const config = {
      active: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100', label: 'Active' },
      banned: { icon: Ban, color: 'text-red-700', bg: 'bg-red-100', label: 'Banned' }
    };
    const selected = config[status] || config.active;
    const Icon = selected.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${selected.bg} ${selected.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {selected.label}
      </span>
    );
  };

  if (isLoading) return <div className="text-center py-10">Loading users...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error: {fetchError?.message || 'Failed to load users.'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, subscriptions, and access controls</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading || isUpdatingStatus}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by user, name, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="flex items-center space-x-2">
                <select
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Join Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user._id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedUser?._id === user._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getUserTypeBadge(user.role)}</td>
                      <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-4 px-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-1">
                          {user.status === 'active' ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateUserStatus(user._id, 'banned'); }}
                              disabled={isUpdatingStatus}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdatingStatus ? 'Banning...' : 'Ban'}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUpdateUserStatus(user._id, 'active'); }}
                              disabled={isUpdatingStatus}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdatingStatus ? 'Unbanning...' : 'Unban'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* --- UPDATED: User Details / Edit Panel to show Metadata --- */}
          {selectedUser && (
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Details</h3>
              <div className="space-y-3">
                <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium">Role:</span> {getUserTypeBadge(selectedUser.role)}</p>
                <p><span className="font-medium">Status:</span> {getStatusBadge(selectedUser.status)}</p>
                <p><span className="font-medium">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                
                {selectedUser.latestMetadata && (
                    <>
                        <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Latest Activity</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-gray-500" />
                                <span>Location:</span>
                                <span>{selectedUser.latestMetadata.location.city}, {selectedUser.latestMetadata.location.region}, {selectedUser.latestMetadata.location.country}</span>
                            </p>
                            <p className="flex items-center space-x-2"><Globe className="w-4 h-4 text-gray-500" />
                                <span>IP Address:</span>
                                <span className="font-mono">{selectedUser.latestMetadata.ip}</span>
                            </p>
                            <p className="flex items-center space-x-2"><Tablet className="w-4 h-4 text-gray-500" />
                                <span>Device:</span>
                                <span>{selectedUser.latestMetadata.device.type || 'N/A'} ({selectedUser.latestMetadata.device.os} / {selectedUser.latestMetadata.device.browser})</span>
                            </p>
                            <p className="flex items-center space-x-2"><Clock className="w-4 h-4 text-gray-500" />
                                <span>Last Active:</span>
                                <span>{new Date(selectedUser.latestMetadata.createdAt).toLocaleString()}</span>
                            </p>
                            {/* You could add the full user agent string if needed, but it's often too long */}
                            {/* <p><span className="font-medium">User Agent:</span> {selectedUser.latestMetadata.userAgent}</p> */}
                        </div>
                    </>
                )}
                
                <div className="pt-4 border-t border-gray-200 mt-4 flex justify-end">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close Details
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;