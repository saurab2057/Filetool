import React, { useState } from 'react'; // Removed useEffect
import apiClient from '@/communication/api';
import { 
  Search, Filter, Clock, CheckCircle, XCircle, Download, RefreshCw // Added RefreshCw for manual refresh icon
} from 'lucide-react';

// --- NEW: Import useQuery from React Query ---
import { useQuery } from '@tanstack/react-query';

// --- 1. Define your data fetching and formatting function outside the component ---
// This function will be called by useQuery. It should return a Promise.
const fetchAndFormatJobs = async () => {
    const response = await apiClient.get('/api/admin/jobs');
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

const JobMonitor = () => {
    // --- 2. Use useQuery to fetch the list of jobs ---
    // React Query handles loading, error, and caching.
    // It also handles the auto-refresh via refetchInterval.
    const {
        data: jobs, // 'data' from useQuery will be your fetched and formatted jobs
        isLoading,  // true while fetching data
        isError,    // true if fetch failed
        error: fetchError, // error object if fetch failed
        refetch,    // Function to manually trigger a refetch
        isFetching  // true if a fetch (initial or background) is in progress
    } = useQuery({
        queryKey: ['jobMonitorJobs'], // Unique key for this data in the cache
        queryFn: fetchAndFormatJobs, // The function that fetches and formats the data
        refetchInterval: 60000,      // Auto-refresh every 60 seconds (matches your original interval)
        refetchIntervalInBackground: false, // Keep refetching even if window is not focused, use true if you want that
        // staleTime and cacheTime from QueryClientProvider will apply here
    });

    // --- Local State for UI filters (remain as useState) ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toolFilter, setToolFilter] = useState('all');

    // Your tools array
    const tools = [
        'Converted to PDF',
        'Converted to DOCX',
        'Resized Image',
        'Compressed File',
        'Extracted Text'
    ];

    // --- getStatusBadge (no changes needed) ---
    const getStatusBadge = (status) => {
        const badgeConfig = {
            completed: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100', label: 'Completed' },
            processing: { icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Processing' },
            failed: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100', label: 'Failed' },
            queued: { icon: Clock, color: 'text-gray-700', bg: 'bg-gray-100', label: 'Queued' }
        };

        const config = badgeConfig[status] || badgeConfig.completed;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    // --- Filtered Jobs: Use 'jobs' data from useQuery ---
    // Ensure 'jobs' is treated as an array, as it could be undefined initially.
    const filteredJobs = (jobs || []).filter(job => {
        const matchesSearch = job.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.id.toLowerCase().includes(searchTerm.toLowerCase()); // Added job ID to search
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        const matchesTool = toolFilter === 'all' || job.tool === toolFilter;
        return matchesSearch && matchesStatus && matchesTool;
    });

    // --- Conditional Rendering based on React Query states ---
    // isLoading is true initially or on explicit refetch.
    // isFetching is true on any fetch, including background refetch.
    if (isLoading) return <div className="p-4 text-center">Loading jobs...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">Error: {fetchError?.message || 'Failed to load jobs.'}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Job Monitor</h1>
                    <p className="text-gray-600 mt-1">Track all file processing jobs and their status</p>
                </div>
                <div className="flex space-x-3">
                    {/* Manual Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching} // Disable while any fetch is in progress
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                        <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export Logs</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by user, filename, or job ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" /> {/* This icon doesn't do anything currently */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                            <option value="queued">Queued</option>
                        </select>

                        <select
                            value={toolFilter}
                            onChange={(e) => setToolFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Tools</option>
                            {tools.map(tool => (
                                <option key={tool} value={tool}>{tool}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Job ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tool</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">File</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Time</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No jobs found matching your criteria.
                                    </td>
                                </tr>
                            )}
                            {(filteredJobs || []).map((job) => ( // Ensure filteredJobs is an array
                                <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{job.id}</td>
                                    <td className="py-4 px-4 text-sm text-gray-900">{job.user}</td>
                                    <td className="py-4 px-4 text-sm text-gray-900">{job.tool}</td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="text-sm text-gray-900">{job.fileName}</div>
                                            <div className="text-xs text-gray-500">{job.fileSize}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">{getStatusBadge(job.status)}</td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="text-sm text-gray-900">{job.timestamp}</div>
                                            {job.processingTime && (
                                                <div className="text-xs text-gray-500">{job.processingTime}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex space-x-2">
                                            {job.error && (
                                                <button
                                                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                    title={job.error}
                                                >
                                                    <span>Error</span>
                                                </button>
                                            )}
                                            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                                Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No jobs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobMonitor;