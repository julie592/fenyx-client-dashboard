import React, { useState } from 'react';

const EXPORTS_DATA = [
  { name: 'Google', schedule: 'Every 6 hours starting at 12:00 am', status: 'success', lastRun: '4 Sep, 12:01 pm', dateRange: '2026-09-01 until today', active: true },
  { name: 'Meta', schedule: 'Every 6 hours starting at 12:00 am', status: 'success', lastRun: '4 Sep, 12:01 pm', dateRange: '2026-09-01 until today', active: true },
  { name: 'Microsoft', schedule: 'Every 6 hours starting at 12:00 am', status: 'success', lastRun: '4 Sep, 12:02 pm', dateRange: '2026-09-01 until today', active: true },
  { name: 'Reddit', schedule: 'Every 6 hours starting at 12:00 am', status: 'success', lastRun: '1 Sep, 8:11 pm', dateRange: '2026-09-01 until today', active: false },
  { name: 'Taboola Native', schedule: 'Every 6 hours starting at 12:00 am', status: 'success', lastRun: '4 Sep, 12:01 pm', dateRange: '2026-09-01 until today', active: true },
];

export default function GoogleSheetSync() {
  const [view, setView] = useState('list'); // 'list' or 'edit'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState(['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks']);

  if (view === 'edit') {
    return (
      <div className="bg-gray-50 h-full p-6">
        <div className="max-w-5xl mx-auto">
          {/* Edit Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">📊</span>
              <h1 className="text-2xl font-bold text-gray-900">Google</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setView('list')} className="px-4 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button className="px-4 py-1.5 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-400 cursor-not-allowed">✓ Save</button>
            </div>
          </div>

          {/* Edit Body */}
          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Data</h2>
            <p className="text-sm text-gray-600 mb-6">Data Explorer Views can be used to import fields, filters and currency. To use a view go to <span className="underline cursor-pointer">Manage views</span>.</p>
            
            <h3 className="text-sm font-bold text-gray-900 mb-2">Fields</h3>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer mb-2">
              <span>⊞</span> Choose fields
            </button>
            <p className="text-sm text-gray-600 mb-8">{selectedFields.length} fields chosen</p>

            <h3 className="text-sm font-bold text-gray-900 mb-2">Dimension filter</h3>
            <div className="flex items-center gap-4 mb-2">
              <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 w-48"><option>Select...</option></select>
              <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 w-48"><option>Select...</option></select>
              <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 bg-gray-50" disabled />
              <span className="text-sm text-gray-500">Or</span>
              <span className="text-gray-400 cursor-pointer">🗑️</span>
            </div>
            <button className="text-teal-600 text-sm font-medium hover:underline mb-8">+ Add</button>

            <h3 className="text-sm font-bold text-gray-900 mb-2">Metric filter</h3>
            <div className="flex items-center gap-4 mb-2">
              <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 w-48"><option>Cost</option></select>
              <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 w-48"><option>&gt;</option></select>
              <input type="text" defaultValue="0" className="border border-gray-300 rounded px-3 py-2 text-sm flex-1" />
              <span className="text-sm text-gray-500">Or</span>
              <span className="text-gray-400 cursor-pointer">🗑️</span>
            </div>
            <button className="text-teal-600 text-sm font-medium hover:underline">+ Add</button>
          </div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Choose Fields</h2>
              </div>
              <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 border-r border-gray-200 flex flex-col">
                  <div className="p-3 flex gap-2 border-b border-gray-200 bg-gray-50">
                    <input type="text" placeholder="Search field name or id" className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1" />
                    <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm font-medium border border-blue-200">✓ Dimensions</button>
                    <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm font-medium border border-blue-200">✓ Metrics</button>
                  </div>
                  <div className="overflow-y-auto p-2">
                    {['Custom', 'Data Source', 'Date', 'Facebook Ads', 'Google Ads', 'Microsoft Advertising'].map(src => (
                      <div key={src} className="flex justify-between items-center p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">{src}</span>
                        <span className="text-gray-400">⌄</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-1/2 flex flex-col">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <span className="font-bold text-sm text-gray-900">Selected fields</span>
                    <span className="text-gray-400 cursor-pointer">🗑️</span>
                  </div>
                  <div className="overflow-y-auto p-2">
                    {selectedFields.map(field => (
                      <div key={field} className="flex justify-between items-center p-3 hover:bg-gray-50 border-b border-gray-100">
                        <span className="text-sm text-gray-700">{field}</span>
                        <div className="flex gap-3 text-gray-400">
                          <span>ℹ️</span><span>🗑️</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700">✓ Use these fields</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="bg-white h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exports</h1>
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded text-sm flex items-center gap-2">
          + Create Export
        </button>
      </div>

      <div className="border-b border-gray-200 mb-4 flex gap-6">
        <button className="pb-3 text-sm font-medium text-gray-500">All (8)</button>
        <button className="pb-3 text-sm font-medium text-teal-700 border-b-2 border-teal-600 flex items-center gap-2">
          <span className="text-green-600">📊</span> Google Sheets (8)
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-500">Actions ⌄</span>
        <div className="flex items-center gap-4 text-gray-600">
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Show 0 deleted</label>
          <span>Choose columns ⌄</span>
          <input type="text" placeholder="Search Exports" className="border border-gray-300 rounded-full px-4 py-1 bg-gray-50 w-48" />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-4 py-3">Name ⌄</th>
              <th className="px-4 py-3">Schedule ⌄</th>
              <th className="px-4 py-3">Status ⌄</th>
              <th className="px-4 py-3">Last Run At ⌄</th>
              <th className="px-4 py-3">Date Range ⌄</th>
              <th className="px-4 py-3 text-right">Actions ⌄</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {EXPORTS_DATA.map((row, idx) => (
              <tr key={idx} className={`hover:bg-gray-50 ${!row.active ? 'bg-blue-50/50' : ''}`}>
                <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                <td className="px-4 py-3 text-gray-500">{row.schedule}</td>
                <td className="px-4 py-3"><span className="text-green-500 border border-green-500 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]">✓</span></td>
                <td className="px-4 py-3 text-gray-500">{row.lastRun}</td>
                <td className="px-4 py-3 text-gray-500">{row.dateRange}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer ${row.active ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="cursor-pointer hover:text-gray-900">⚡</span>
                    <span onClick={() => setView('edit')} className="cursor-pointer hover:text-gray-900">✏️</span>
                    <span className="cursor-pointer hover:text-gray-900">⋮</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
