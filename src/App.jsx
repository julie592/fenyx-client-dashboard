import React, { useState } from 'react';
import GoogleSheetSync from './pages/GoogleSheetSync';
import Overview from './pages/Overview';
import PlatformPerformance from './pages/PlatformPerformance';
import DataSources from './pages/DataSources';
import Settings from './pages/Settings';

// Clean SVG Icons (Heroicons/Lucide style)
const Icons = {
  Home: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-.504V9.75M8.25 21h8.25" /></svg>,
  Data: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0v3.75C20.25 20.897 16.556 22.875 12 22.875s-8.25-1.978-8.25-4.25v-3.75" /></svg>,
  Dashboard: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  Export: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>,
  Settings: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.781.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
};

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const navItems = [
    { name: 'Home', path: '/', icon: Icons.Home },
    { name: 'Data', path: '/data', icon: Icons.Data },
    { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
    { name: 'Export', path: '/export', icon: Icons.Export },
    { name: 'Settings', path: '/settings', icon: Icons.Settings }
  ];

  const renderPage = () => {
    if (currentPath === '/') return <Overview />;
    if (currentPath === '/data') return <DataSources />;
    if (currentPath === '/dashboard') return <PlatformPerformance />;
    if (currentPath === '/export') return <GoogleSheetSync />;
    if (currentPath === '/settings') return <Settings />;
    return <Overview />;
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Funnel.io Style Thin Sidebar */}
      <div className="w-[88px] bg-white border-r border-gray-200 flex flex-col items-center py-4 z-10 flex-shrink-0">
        <div className="h-9 w-9 rounded-lg bg-teal-800 flex items-center justify-center font-bold text-white mb-6 shadow-sm">F</div>
        <div className="flex flex-col gap-1 w-full px-2">
          {navItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => setCurrentPath(item.path)}
              className={`flex flex-col items-center justify-center py-3.5 rounded-lg w-full transition-colors cursor-pointer group ${
                currentPath === item.path ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${currentPath === item.path ? 'text-teal-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
        {/* Funnel.io Style Top Navigation */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center text-sm">
            <span className="text-gray-900 font-semibold">Fenyx Workspace</span>
            <span className="mx-3 text-gray-300">/</span>
            <span className="text-gray-600 cursor-pointer hover:text-gray-900 font-medium">Production Environment ⌄</span>
          </div>
          <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-500 flex items-center gap-2">
            Navigate to <kbd className="font-sans border border-gray-200 rounded px-1.5 py-0.5 bg-white font-semibold shadow-sm">⌘ K</kbd>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
