import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import AssetDetail from './pages/AssetDetail';
import SubmitAsset from './pages/SubmitAsset';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/submit" element={<SubmitAsset />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen relative overflow-hidden font-sans flex flex-col transition-colors duration-700 ease-in-out ${
        isDark ? 'bg-obsidian-950 text-slate-100' : 'bg-parchment-200 text-slate2-900'
      }`}
    >
      {/* Abstract Background Glow */}
      {isDark ? (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gold-600/5 rounded-full blur-[120px] pointer-events-none transition-opacity duration-700" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-obsidian-700/10 rounded-full blur-[120px] pointer-events-none transition-opacity duration-700" />
        </>
      ) : (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gold-300/10 rounded-full blur-[120px] pointer-events-none transition-opacity duration-700" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-parchment-400/30 rounded-full blur-[120px] pointer-events-none transition-opacity duration-700" />
        </>
      )}

      <Navbar />

      <main className="flex-1 mt-20 z-10 w-full">
        <AnimatedRoutes />
      </main>

      {/* Footer */}
      <footer className={`z-10 border-t py-8 relative transition-colors duration-500 ${
        isDark
          ? 'bg-obsidian-950 border-obsidian-800'
          : 'bg-parchment-300 border-parchment-500/50'
      }`}>
        <div className={`max-w-7xl mx-auto px-4 text-center text-sm font-sans tracking-wide ${
          isDark ? 'text-slate-muted' : 'text-slate2-600'
        }`}>
          © {new Date().getFullYear()} Aura Protocol.
          <br />
          Bridging Physical Provenance and Digital Ownership.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppShell />
      </Router>
    </ThemeProvider>
  );
}

export default App;
