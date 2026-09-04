import React, { useState, useEffect } from 'react';

export default function DataExplorer() {
  const [fields, setFields] = useState({ dimensions: [], metrics: [] });
  const [activeView, setActiveView] = useState({
    dimensions: ['Date', 'Platform', 'Campaign Name'],
    metrics: ['Spend', 'Impressions', 'Clicks', 'Purchases']
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/fields`)
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setFields({
            dimensions: data.filter(f => f.field_type === 'Dimension'),
            metrics: data.filter(f => f.field_type === 'Metric')
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-full bg-white">
      <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Data Explorer</h2>
          <p className="text-xs text-gray-500 mt-1">Query normalized Fenyx data</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dimensions</h3>
            <div className="space-y-1">
              {fields.dimensions.map(d => (
                <div key={d.id} className="flex items-center gap-2 text-sm text-gray-700 p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> {d.name}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Metrics</h3>
            <div className="space-y-1">
              {fields.metrics.map(m => (
                <div key={m.id} className="flex items-center gap-2 text-sm text-gray-700 p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> {m.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white outline-none">
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Year to Date</option>
            </select>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm border border-gray-200 font-medium cursor-pointer hover:bg-gray-200">
              + Add Filter
            </button>
          </div>
          <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-medium cursor-pointer shadow-sm">
            Load Data
          </button>
        </div>

        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-700 whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {activeView.dimensions.map(d => <th key={d} className="px-4 py-3 border-r border-gray-100">{d}</th>)}
                  {activeView.metrics.map(m => <th key={m} className="px-4 py-3 text-right">{m}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={activeView.dimensions.length + activeView.metrics.length} className="px-4 py-12 text-center text-gray-400">
                    <div className="text-lg mb-2">🔍</div>
                    <div>Click "Load Data" to query the Engine.</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
