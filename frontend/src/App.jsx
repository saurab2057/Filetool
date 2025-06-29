import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/footer'; // Or '../components/Footer' depending on where this file lives
import HomePage from '@/pages/Home';
import PngToSvgConverter from '@/pages/pngtosvg';
import Mp4ToMp3Converter from '@/pages/mp4tomp3';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/png-to-svg" element={<PngToSvgConverter />} />
          <Route path="/mp4-to-mp3" element={<Mp4ToMp3Converter />} />
          {/* Add more converter routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;