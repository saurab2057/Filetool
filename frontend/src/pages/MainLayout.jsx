import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpChatbot from '@/components/Chatbot';

const MainLayout = () => {
  return (
    // Use a div as the main container to apply flexbox layout
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      {/* The "flex-grow" class tells this element to expand and fill available space */}
      <main className="flex-grow">
        <Outlet /> {/* Render child routes here */}
      </main>
      <Footer />
      <HelpChatbot />
    </div>
  );
};

export default MainLayout;