import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.js';
import { TopNav } from '../components/navigation/TopNav.js';
import { CreateMissionModal } from '../components/missions/CreateMissionModal.js';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [quickMissionOpen, setQuickMissionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-gray-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <TopNav
          onMenuClick={() => setCollapsed(!collapsed)}
          onOpenQuickMission={() => setQuickMissionOpen(true)}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Mission Modal */}
      <CreateMissionModal
        isOpen={quickMissionOpen}
        onClose={() => setQuickMissionOpen(false)}
        onMissionCreated={() => {
          // Trigger custom event so any active page query can refresh
          window.dispatchEvent(new Event('mission-refetch'));
        }}
      />
    </div>
  );
};
