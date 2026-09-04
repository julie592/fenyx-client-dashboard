import React from 'react';

export default function Overview() {
  return (
    <div className="max-w-6xl mx-auto text-gray-900 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workspace Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time status of your Fenyx data pipeline.</p>
      </div>

      {/* Data Flow Pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Data Pipeline</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          {/* Sources */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-6 w-full">
            <div className="text-3xl mb-2">📥</div>
            <div className="font-bold text-gray-900 text-lg">10 Data Sources</div>
            <div className="text-xs text-gray-500 mt-1">Meta, Google, TikTok, Taboola...</div>
            <div className="mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full inline-block border border-green-200">Connected</div>
          </div>
          
          <div className="text-gray-300 font-bold text-2xl hidden md:block">→</div>
          
          {/* Engine */}
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-6 w-full shadow-inner shadow-blue-500/10">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-blue-900 text-lg">Fenyx Engine</div>
            <div className="text-xs text-blue-600/70 mt-1">Transforming & Mapping Data</div>
            <div className="mt-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full inline-block border border-blue-200">Processing</div>
          </div>

          <div className="text-gray-300 font-bold text-2xl hidden md:block">→</div>

          {/* Destinations */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-6 w-full">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-gray-900 text-lg">1 Destination</div>
            <div className="text-xs text-gray-500 mt-1">Google Sheets (Multi-Tab)</div>
            <div className="mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full inline-block border border-green-200">Last Sync: 12m ago</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Rows Synced (Today)</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">1,248</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Active Campaigns Tracking</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">42</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Error Rate</div>
          <div className="text-3xl font-bold text-green-600 mt-2">0.00%</div>
        </div>
      </div>
    </div>
  );
}
