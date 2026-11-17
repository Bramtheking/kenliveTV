import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';

// Pages
import Home from './pages/Home';
import WatchLive from './pages/WatchLive';
import Schedule from './pages/Schedule';
import Shows from './pages/Shows';
import ShowDetail from './pages/ShowDetail';
import News from './pages/News';
import Replays from './pages/Replays';
import Advertise from './pages/Advertise';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Helper component to scroll to top on page navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut to open search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] dark:bg-[#0B0B0C] text-[#111827] dark:text-[#F3F4F6] transition-colors duration-200">
      <ScrollToTop />
      
      {/* Sticky Broadcast Header */}
      <Header onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Page Route View */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<WatchLive />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/shows/:slug" element={<ShowDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/replays" element={<Replays />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation Bar (Live, Schedule, News, Radio) */}
      <BottomNav />

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
