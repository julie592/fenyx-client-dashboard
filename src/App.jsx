import React from 'react';
import GoogleSheetSync from './pages/GoogleSheetSync';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-y-auto">
      {/* Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              fenyx engine
            </span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
              v1.0 Live
            </span>
          </div>
        </div>
      </header>

      {/* Main Page View */}
      <main className="py-8 pb-20">
        <GoogleSheetSync />
      </main>
    </div>
  );
}
