import React from 'react';
import GoogleSheetSync from './pages/GoogleSheetSync';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            F
          </div>
          <span className="font-bold text-xl tracking-wide text-gray-900">fenyx dashboard</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">
          Engine Online
        </span>
      </header>

      <main className="py-8">
        <GoogleSheetSync />
      </main>
    </div>
  );
}
