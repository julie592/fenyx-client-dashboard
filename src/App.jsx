import React, { useState } from 'react';
import GoogleSheetSync from './pages/GoogleSheetSync';
import Overview from './pages/Overview';
import PlatformPerformance from './pages/PlatformPerformance';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/export');

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Funnel AI', path: '/ai', icon: '✨' },
    { name: 'Data', path: '/data', icon: '📦' },
    { name: 'Report', path: '/report', icon: '📊' },
    { name: 'Measure', path: '/measure', icon: '📐' },
    { name: 'Export', path: '/export', icon: '📤' },
    { name: 'More', path: '/more', icon: '•••' }
  ];

  const renderPage = () => {
    if (currentPath === '/') return <Overview />;
    if (currentPath === '/report') return <PlatformPerformance />;
    if (currentPath === '/export') return <GoogleSheetSync />;
    return <Overview />;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Funnel.io Style Thin Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-10">
        <div className="h-8 w-8 rounded bg-teal-800 flex items-center justify-center font-bold text-white mb-6">F</div>
        <div className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => setCurrentPath(item.path)}
              className={`flex flex-col items-center justify-center py-3 rounded-lg w-full transition-colors cursor-pointer ${
                currentPath === item.path ? 'bg-teal-50 text-teal-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Funnel.io Style Top Navigation */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center text-sm">
            <span className="text-gray-900 font-medium">Fenyx</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 cursor-pointer hover:text-gray-900">My first Workspace ⌄</span>
          </div>
          <div className="ml-8 px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-500 flex items-center gap-2">
            Navigate to <kbd className="font-sans border border-gray-300 rounded px-1 bg-white">⌘ K</kbd>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
