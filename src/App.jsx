import React from 'react';
import GoogleSheetSync from './pages/GoogleSheetSync';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            F
          </div>
          <span className="font-bold text-lg tracking-wide text-white">fenyx</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          Engine Online
        </span>
      </header>

      <main className="py-6">
        <GoogleSheetSync />
      </main>
    </div>
  );
}
