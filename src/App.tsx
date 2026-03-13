import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import AssetDetail from './pages/AssetDetail';
import SubmitAsset from './pages/SubmitAsset';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import Auth from './pages/Auth';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Profile from './pages/Profile';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/submit" element={<ProtectedRoute><SubmitAsset /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen relative font-sans flex flex-col transition-colors duration-700 ease-in-out bg-obsidian-950 text-slate-100">
      {/* Background container that hides overflow without affecting the document flow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Abstract Background Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gold-600/5 rounded-full blur-[120px] transition-opacity duration-700" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-obsidian-700/10 rounded-full blur-[120px] transition-opacity duration-700" />
      </div>

      <Navbar />

      <main className="flex-1 mt-20 z-10 w-full">
        <AnimatedRoutes />
      </main>

      {/* Footer */}
      <footer className="z-10 border-t py-8 relative transition-colors duration-500 bg-obsidian-950 border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-sans tracking-wide text-slate-muted">
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
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
