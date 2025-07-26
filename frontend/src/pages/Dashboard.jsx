import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/communication/AuthContext';
import apiClient from '@/communication/api';
import Header from '@/components/Header';
import { formatDistanceToNow } from 'date-fns';
import Footer from '@/components/Footer';
import {
    Settings, Loader2, AlertCircle, Calendar, Mail, Award, Camera,
    Save, X, RotateCw, AlertTriangle, FileText, FileImage,
    FileVideo, FileAudio, CreditCard
} from 'lucide-react';

// =================================================================================
// 1. CHILD COMPONENT: ProfileCard
// =================================================================================
const ProfileCard = ({ user, isEditing, handleEditToggle, isSaving, handleSaveAllChanges, error, setError }) => {
    const [editForm, setEditForm] = useState({ name: '' });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);

    // Sync form with user data when editing starts or user changes
    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name || '' });
            setProfilePicPreview(user.profilePictureUrl || null);
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const onSave = () => {
        // Pass local state changes up to the parent to handle the API call
        handleSaveAllChanges(editForm, profilePicFile);
    };

    const onCancel = () => {
        // Reset local state on cancel
        setEditForm({ name: user?.name || '' });
        setProfilePicFile(null);
        setProfilePicPreview(user?.profilePictureUrl || null);
        setError(null); // Clear any previous errors
        handleEditToggle();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-6">
                    {user && (<img
                        src={profilePicPreview || user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=96`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-800 shadow-lg"
                    />)}
                    {!isEditing && <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white dark:border-gray-800 shadow-sm"></div>}

                    {isEditing && (
                        <>
                            <input type="file" id="profilePicUpload" className="hidden" accept="image/jpeg, image/png" onChange={handleFileChange} disabled={isSaving} />
                            <label htmlFor="profilePicUpload" className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800 transition-transform hover:scale-110" title="Change picture">
                                <Camera className="w-4 h-4 text-white" />
                            </label>
                        </>
                    )}
                </div>

                {/* User Details */}
                <div className="space-y-2 mb-6">
                    {!isEditing ? (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    ) : (
                        <input
                            id="name"
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full text-center text-2xl font-bold px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            placeholder="Enter your name"
                            disabled={isSaving}
                        />
                    )}
                    <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                    </div>
                </div>

                {/* User Stats */}
                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"><Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><Award className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Files</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.filesConverted?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Free Plan</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    {isEditing ? (
                        <>
                            <button onClick={onSave} disabled={isSaving} className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-500/80 disabled:cursor-not-allowed text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button onClick={onCancel} disabled={isSaving} className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500/80 disabled:cursor-not-allowed text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm">
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEditToggle} className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm">
                            <Settings className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg flex items-center space-x-2 text-sm text-left">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-800 font-bold">×</button>
                    </div>
                )}
            </div>
        </div>
    );
};


// =================================================================================
// 2. CHILD COMPONENT: WeeklyActivityChart
// =================================================================================
const WeeklyActivityChart = () => {
    const [animationProgress, setAnimationProgress] = useState(0);
    const [hoveredBar, setHoveredBar] = useState(null);

    const data = [
        { day: 'Mon', files: 12, label: 'Monday' },
        { day: 'Tue', files: 19, label: 'Tuesday' },
        { day: 'Wed', files: 15, label: 'Wednesday' },
        { day: 'Thu', files: 22, label: 'Thursday' },
        { day: 'Fri', files: 18, label: 'Friday' },
        { day: 'Sat', files: 8, label: 'Saturday' },
        { day: 'Sun', files: 5, label: 'Sunday' },
    ];

    const maxFiles = Math.max(...data.map(d => d.files));

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationProgress(1);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Activity</h3>
                <p className="text-gray-600 dark:text-gray-400">Your file processing activity over the last 7 days</p>
            </div>
            <div className="relative">
                <div className="flex justify-between items-end h-72 space-x-4">
                    {data.map((item, index) => {
                        const barHeight = (item.files / maxFiles) * 288; // 288 is h-72
                        const animatedHeight = barHeight * animationProgress;
                        const isHovered = hoveredBar === index;

                        return (
                            <div key={item.day} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                {/* Value Tooltip */}
                                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                    <div className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl relative">
                                        {item.files} files
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
                                    </div>
                                </div>
                                {/* Main Bar */}
                                <div
                                    className={`w-full bg-gradient-to-t from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-t-lg transition-all duration-700 ease-out cursor-pointer group-hover:from-blue-500 group-hover:to-blue-400`}
                                    style={{ height: `${animatedHeight}px`, transitionDelay: `${index * 100}ms` }}
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                />
                                {/* Day Label */}
                                <div className="mt-3 text-center">
                                    <span className={`text-sm font-semibold transition-colors duration-200 ${isHovered ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {item.day}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// =================================================================================
// 3. CHILD COMPONENT: RecentActivityList
// =================================================================================
const RecentActivityList = ({ history, isLoading, error }) => {
    // Helper functions can be defined inside or outside the component
    const getFileIcon = (format) => {
        const fmt = format?.toLowerCase();
        if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(fmt)) return FileVideo;
        if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(fmt)) return FileImage;
        if (['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(fmt)) return FileAudio;
        return FileText;
    };
    const getIconColor = (format) => {
        const fmt = format?.toLowerCase();
        if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(fmt)) return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
        if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(fmt)) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
        if (['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(fmt)) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    };
    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-12 text-gray-500 dark:text-gray-400">
                    <RotateCw className="w-6 h-6 animate-spin mr-3" />
                    <span>Loading Recent Activity...</span>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex justify-center items-center p-12 text-red-600 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 mr-3" />
                    <span>{error}</span>
                </div>
            );
        }
        if (!history || history.length === 0) {
            return (
                <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                    <p>You have no conversion history yet.</p>
                </div>
            );
        }

        return (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.slice(0, 5).map((item) => { // show latest 5
                    const IconComponent = getFileIcon(item.format);
                    const iconColor = getIconColor(item.format);
                    return (
                        <div key={item._id} className="flex items-center space-x-4 p-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.filename}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Converted to <span className="font-semibold uppercase">{item.format}</span>
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(new Date(item.processedAt), { addSuffix: true })}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{formatBytes(item.sizeInBytes)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Your latest file processing activities</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">View All</button>
            </div>
            {renderContent()}
        </div>
    );
};


// =================================================================================
// PARENT COMPONENT: The Dashboard (Now a clean manager)
// =================================================================================
const Dashboard = () => {
    const { user, updateUser, isAuthenticated, authLoading } = useAuth();
    // const { theme } = useTheme(); // Uncomment this when your ThemeContext is ready
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);

    // --- AUTHENTICATION CHECK ---
    useEffect(() => {
        if (authLoading) return; // Wait until auth check is complete
        if (!isAuthenticated) {
            navigate('/'); // Redirect to home/login if not authenticated
        }
    }, [isAuthenticated, authLoading, navigate]);

    // --- FETCH USER HISTORY ---
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setHistoryLoading(true);
                const response = await apiClient.get('/api/history');
                setHistory(response.data);
                setHistoryError(null);
            } catch (err) {
                console.error("Failed to fetch conversion history:", err);
                setHistoryError("Could not load recent activity.");
            } finally {
                setHistoryLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchHistory();
        }
    }, [isAuthenticated]);

    // --- PROFILE UPDATE HANDLER ---
    const handleSaveAllChanges = async (editForm, profilePicFile) => {
        if (!editForm.name.trim()) {
            setError("Name cannot be empty.");
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            let hasChanges = false;

            if (editForm.name !== user.name) {
                formData.append('name', editForm.name);
                hasChanges = true;
            }
            if (profilePicFile) {
                formData.append('profilePicture', profilePicFile);
                hasChanges = true;
            }

            if (hasChanges) {
                const response = await apiClient.put('/api/user/profile', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                updateUser(response.data.user);
            }

            setIsEditing(false);
        } catch (err) {
            console.error('Profile update error:', err);
            const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            setError(null); // Clear errors when cancelling edit mode
        }
    }

    // --- CONDITIONAL "EARLY RETURNS" ---
    if (authLoading) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
    }

    if (!isAuthenticated || !user) {
        // This will briefly appear before the useEffect redirects.
        // Or you can show a dedicated "Access Denied" page.
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700 shadow-md">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Please log in to view the dashboard.</p>
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Go to Login</Link>
                </div>
            </div>
        );
    }

    // --- THE CLEAN MAIN RETURN ---
    return (
        // The `theme` class from a ThemeProvider would typically go on the `<html>` tag.
        // If your ThemeProvider is set up correctly, you don't need to wrap this div.
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        <ProfileCard
                            user={user}
                            isEditing={isEditing}
                            handleEditToggle={handleEditToggle}
                            isSaving={isSaving}
                            handleSaveAllChanges={handleSaveAllChanges}
                            error={error}
                            setError={setError}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <WeeklyActivityChart />
                        <RecentActivityList
                            history={history}
                            isLoading={historyLoading}
                            error={historyError}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;