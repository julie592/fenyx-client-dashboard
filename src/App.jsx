import React, { useState } from 'react';
import GoogleSheetSync from './pages/GoogleSheetSync';
import Dashboard from './pages/Dashboard';
import DataSources from './pages/DataSources';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const navItems = [
    { title: 'OVERVIEW', items: [] },
    { 
      title: 'DASHBOARD', 
      items: [
        { name: 'All Platforms', path: '/', icon: '📊' },
        { name: 'Individual Platforms', path: '/platform-details', icon: '📈' },
        { name: 'Video Metrics', path: '/video-metrics', icon: '▶️' }
      ] 
    },
    { 
      title: 'SETTINGS', 
      items: [
        { name: 'Google Sheet Sync', path: '/settings/sync', icon: '📑' },
        { name: 'Data Sources', path: '/settings/data-sources', icon: '🗄️' }
      ] 
    }
  ];

  // Simple native router
  const renderPage = () => {
    if (currentPath.startsWith('/settings/sync')) return <GoogleSheetSync />;
    if (currentPath.startsWith('/settings/data-sources')) return <DataSources />;
    return <Dashboard />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md mr-3">F</div>
          <span className="font-bold text-xl tracking-wide text-gray-900">fenyx</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-8">
          {navItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold text-gray-400 mb-3 px-2 tracking-wider">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <button 
                      key={item.name} 
                      onClick={() => setCurrentPath(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <span className={isActive ? 'opacity-100' : 'opacity-60'}>{item.icon}</span>
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Marketing Attribution Engine</div>
          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">Engine Online</span>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
