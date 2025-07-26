// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeContext';
import MainLayout from '@/pages/MainLayout';
import HomePage from '@/pages/Home';
import Mp4ToMp3Converter from '@/pages/MP4toMp3';
import PngToSvgConverter from '@/pages/pngtosvg';
import SignUpForm from '@/pages/Signup';
import LoginForm from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/communication/AuthContext';
import ProtectedRoute from '@/communication/ProtectionRoute';
import AdminRoute from '@/communication/AdminRoute';
import ResetPasswordPage from '@/pages/resetpassword';
import ForgotPasswordPage from '@/pages/forgetpassword';
import MovToMp4Converter from '@/pages/MovToMp4';
import AdminMainLayout from '@/pages/Adminpages/AdminMainLayout';

// --- IMPORTS FOR REACT QUERY ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional: for debugging
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '720705456854-qetqatdv8oqjvn8jc1hnfov97eu0d3sg.apps.googleusercontent.com';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* --- NEW: Wrap with QueryClientProvider HERE --- */}
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <Routes>
                {/* --- Public Routes --- */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/mp4-to-mp3" element={<Mp4ToMp3Converter />} />
                  <Route path="/png-to-svg" element={<PngToSvgConverter />} />
                  <Route path="/mov-to-mp4" element={<MovToMp4Converter />} />
                </Route>

                {/* --- Auth Routes --- */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* --- Protected Route for Standard Users --- */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* --- Protected Route for Admins --- */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminMainLayout />
                    </AdminRoute>
                  }
                />

                {/* --- Fallback Route --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </GoogleOAuthProvider>
          {/* Optional: React Query Devtools for debugging. Place it outside AuthProvider if you want it to catch all queries. */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
