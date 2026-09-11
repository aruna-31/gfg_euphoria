import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { ToastContainer } from '../components/common/ToastContainer';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 flex flex-col antialiased">
      {/* Single Clean Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Floating Alerts Container */}
      <ToastContainer />

      <div className="flex-1 flex">
        {/* Single Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Single Main Content Canvas */}
        <main className="flex-1 lg:pl-60 min-h-[calc(100vh-4rem)] flex flex-col bg-[#111827]">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

          {/* Minimal Clean Footer */}
          <footer className="border-t border-[#26364a] bg-[#0f1723] py-3.5 px-6 text-center text-xs text-gray-500 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
              <span>
                Â© 2026 Hackodessey 4.0 â€¢ GeeksforGeeks Student Chapter KARE
              </span>
              <span className="text-[#00b259]">
                Production Multi-Portal Architecture
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
