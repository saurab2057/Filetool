import React from 'react'; // Removed useState, useEffect
import { Clock, CheckCircle, XCircle, Server, Users } from 'lucide-react';
import apiClient from '@/communication/api';

// --- NEW IMPORTS FROM REACT QUERY ---
import { useQuery } from '@tanstack/react-query';

// --- 1. Define separate data fetching functions outside the component ---

// Function to fetch dashboard statistics
const fetchAdminStats = async () => {
    const { data } = await apiClient.get('/api/admin/stats');
    return data;
};

// Function to fetch recent jobs, similar to JobMonitor's formatting
const fetchRecentJobsData = async () => {
    const response = await apiClient.get('/api/admin/jobs');
    // Apply the same formatting as in JobMonitor for consistency
    const formattedJobs = response.data.map(job => ({
        ...job,
        id: job._id,
        user: job.userId?.email || 'Unknown', // Ensure userId might be populated
        tool: `Converted to ${job.format}` || 'Unknown Tool', // Ensure job.format exists
        fileName: job.filename,
        fileSize: `${(job.sizeInBytes / 1024 / 1024).toFixed(2)} MB`,
        status: job.status || 'completed', // Default status if not provided
        timestamp: new Date(job.processedAt || job.createdAt).toLocaleString(),
        processingTime: job.processingTimeMs ? `${job.processingTimeMs}ms` : null,
        error: job.error || null
    }));
    return formattedJobs;
};


// Reusable Metrics Card Component (no changes needed)
const MetricsCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      amber: 'bg-amber-50 text-amber-600 border-amber-200'
    };
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-sm text-gray-600">{title}</p>
            </div>
        </div>
    );
};

// Recent Jobs Component (no changes needed, it receives jobs as a prop)
const RecentJobs = ({jobs}) => {
    const getStatusBadge = (status) => {
        const classes = { completed: 'bg-green-100 text-green-800' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
                <CheckCircle className="w-4 h-4 text-green-500 mr-1.5" />
                <span className="capitalize">{status}</span>
            </span>
        );
    };

    if (!jobs || jobs.length === 0) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
                <p className="text-gray-500 text-center py-4">No recent jobs to display.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
            <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                    // Make sure job._id and job.userId.email are always available
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{job.fileName}</p>
                            <p className="text-xs text-gray-500">{job.user}</p>
                        </div>
                        {getStatusBadge(job.status)}
                    </div>
                ))}
            </div>
        </div>
    );
}


const AdminDashboard = () => {
  // --- 2. Use useQuery for dashboard statistics ---
  const {
    data: stats,         // 'data' from useQuery will be your fetched stats
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = useQuery({
    queryKey: ['adminStats'], // Unique key for stats data
    queryFn: fetchAdminStats,
    refetchInterval: 60000, // Optional: Refetch stats every 60 seconds (1 minute)
    refetchIntervalInBackground: false, // Keep refetching even if not focused
  });

  // --- 3. Use useQuery for recent jobs ---
  const {
    data: recentJobs,     // 'data' from useQuery will be your fetched jobs
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
    error: jobsError,
  } = useQuery({
    queryKey: ['recentDashboardJobs'], // Unique key for recent jobs data (different from JobMonitor's)
    queryFn: fetchRecentJobsData,
    refetchInterval: 60000,             //  Refetch recent jobs every 15 seconds for more real-time feel
    refetchIntervalInBackground: false, // Keep refetching even if not focused true and false
  });

  // --- Combine loading and error states ---
  const isLoading = isLoadingStats || isLoadingJobs;
  const isError = isErrorStats || isErrorJobs;
  const combinedError = statsError || jobsError;

  // --- Conditional Rendering based on React Query states ---
  if (isLoading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Error: {combinedError?.message || 'Failed to load dashboard data.'}</div>;

  // Ensure stats and recentJobs are available before rendering.
  // Although useQuery returns undefined while loading, this check is good practice.
  if (!stats || !recentJobs) return null; // Should ideally not happen if isLoading is handled

  const metrics = [
    { title: 'Total Users', value: stats.totalUsers.value, icon: Users, color: 'blue' },
    { title: 'Successful Jobs (24h)', value: stats.successfulJobs.value, icon: CheckCircle, color: 'green' },
    { title: 'Failed Jobs (24h)', value: stats.failedJobs.value, icon: XCircle, color: 'red' },
    { title: 'Server Load', value: stats.serverLoad.value, icon: Server, color: 'amber' }
  ];

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Live overview of your FileTools service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
            ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Pass the data from useQuery to the RecentJobs component */}
            <RecentJobs jobs={recentJobs} />
        </div>
    </div>
  );
};

export default AdminDashboard;