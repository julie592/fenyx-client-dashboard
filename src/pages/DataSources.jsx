import React from 'react';

const SOURCES = [
  { name: 'Meta Ads', status: 'Connected', account: 'Act_1092834', icon: 'M' },
  { name: 'Google Ads', status: 'Connected', account: 'MCC Fenyx', icon: 'G' },
  { name: 'TikTok Ads', status: 'Action Required', account: 'Not connected', icon: 'T' },
  { name: 'Taboola', status: 'Not Connected', account: '', icon: 'Ta' },
];

export default function DataSources() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Sources</h1>
          <p className="text-sm text-gray-500 mt-1">Connect and manage your marketing API integrations.</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-medium transition-colors">
          + Connect Data Source
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Account ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SOURCES.map((source, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center font-bold text-gray-600 bg-white shadow-sm">
                      {source.icon}
                    </div>
                    <span className="font-medium text-gray-900">{source.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {source.status === 'Connected' ? (
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1.5 w-max">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Connected
                    </span>
                  ) : source.status === 'Action Required' ? (
                     <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200 flex items-center gap-1.5 w-max">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      Auth Required
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium text-xs">Not Configured</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{source.account || '—'}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-teal-600 hover:text-teal-800 font-medium text-xs">Configure</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
