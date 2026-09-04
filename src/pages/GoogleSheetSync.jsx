import React, { useState, useEffect } from 'react';

// Fallback data matching the Funnel.io screenshot
const DEFAULT_EXPORTS = [
  { id: 1, platform: 'Google', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:01 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks'] },
  { id: 2, platform: 'Meta', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:01 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks'] },
  { id: 3, platform: 'Microsoft', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:02 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks'] },
  { id: 4, platform: 'Reddit', schedule: 'Every 6 hours starting at 12:00 am', is_active: false, lastRun: '1 Sep, 8:11 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost'] },
  { id: 5, platform: 'Taboola Native', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:01 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks'] },
  { id: 6, platform: 'Taboola Video', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:00 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks'] },
  { id: 7, platform: 'Tiktok', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:00 pm', date_range: '2026-09-01 until today', selected_fields: ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks'] }
];

export default function GoogleSheetSync() {
  const [view, setView] = useState('list');
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Edit/Create View
  const [editingExport, setEditingExport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedFields, setTempSelectedFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchExports = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/exports`);
      if (res.ok) {
        const data = await res.json();
        // If DB is empty, use defaults so UI isn't blank
        setExports(data.length > 0 ? data : DEFAULT_EXPORTS);
      } else {
        throw new Error("API returned non-OK");
      }
    } catch (err) {
      console.warn('API fetch failed, using fallback UI data:', err);
      setExports(DEFAULT_EXPORTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleEdit = (exp) => {
    setEditingExport(exp);
    setTempSelectedFields(exp.selected_fields || ['Media type', 'Campaign', 'Cost', 'Impressions', 'Clicks']);
    setView('edit');
  };

  const handleCreateNew = () => {
    setEditingExport({
      id: Date.now(),
      platform: 'New Platform Sync',
      schedule: 'Every 6 hours starting at 12:00 am',
      is_active: true,
      lastRun: 'Never',
      date_range: '2026-09-01 until today',
      selected_fields: []
    });
    setTempSelectedFields(['Media type', 'Campaign', 'Cost']);
    setView('edit');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        id: editingExport.id,
        is_active: editingExport.is_active,
        date_range: editingExport.date_range,
        selected_fields: tempSelectedFields
      };
      
      // Try to save to backend (fails silently and updates UI if backend isn't ready)
      await fetch(`${API_BASE_URL}/api/exports/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => console.log('Mock saved'));
      
      // Optimistic UI Update
      setExports(prev => {
        const exists = prev.find(p => p.id === payload.id);
        if (exists) {
          return prev.map(p => p.id === payload.id ? { ...p, ...payload, selected_fields: tempSelectedFields } : p);
        }
        return [...prev, { ...editingExport, ...payload, selected_fields: tempSelectedFields }];
      });
      setView('list');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = (exp) => {
    const newStatus = !exp.is_active;
    setExports(exports.map(e => e.id === exp.id ? { ...e, is_active: newStatus } : e));
    
    // Background attempt to update DB
    fetch(`${API_BASE_URL}/api/exports/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: exp.id, is_active: newStatus, date_range: exp.date_range, selected_fields: exp.selected_fields })
    }).catch(() => {});
  };

  if (view === 'edit' && editingExport) {
    return (
      <div className="bg-gray-50 h-full p-6">
        <div className="max-w-5xl mx-auto">
          {/* Edit Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">📊</span>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{editingExport.platform}</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setView('list')} className="px-4 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded text-sm font-medium cursor-pointer flex items-center gap-2">
                {isSaving ? 'Saving...' : '✓ Save'}
              </button>
            </div>
          </div>

          {/* Edit Body */}
          <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Data</h2>
            <p className="text-sm text-gray-600 mb-6">Data Explorer Views can be used to import fields, filters and currency.</p>
            
            <h3 className="text-sm font-bold text-gray-900 mb-2">Fields</h3>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer mb-2">
              <span>⊞</span> Choose fields
            </button>
            <p className="text-sm text-gray-600 mb-8">{tempSelectedFields.length} fields chosen</p>

            <h3 className="text-sm font-bold text-gray-900 mb-2">Export Schedule & Range</h3>
            <div className="grid grid-cols-2 gap-4 mb-2">
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Date Range</label>
                  <input type="text" value={editingExport.date_range} onChange={(e) => setEditingExport({...editingExport, date_range: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-teal-500" />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Schedule</label>
                  <input type="text" readOnly value={editingExport.schedule} className="border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm w-full cursor-not-allowed" />
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Selected Fields</h2>
              <textarea 
                className="w-full border border-gray-300 rounded p-3 text-sm h-32 mb-4 outline-none focus:ring-1 focus:ring-teal-500" 
                value={tempSelectedFields.join(', ')}
                onChange={(e) => setTempSelectedFields(e.target.value.split(',').map(s => s.trimStart()))}
                placeholder="e.g. Media type, Campaign, Cost..."
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 cursor-pointer">Close</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 cursor-pointer">Done</button>
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
        <button onClick={handleCreateNew} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          + Create Export
        </button>
      </div>

      <div className="border-b border-gray-200 mb-4 flex gap-6">
        <button className="pb-3 text-sm font-medium text-gray-500">All ({exports.length})</button>
        <button className="pb-3 text-sm font-medium text-teal-700 border-b-2 border-teal-600 flex items-center gap-2">
          <span className="text-green-600">📊</span> Google Sheets ({exports.length})
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Platform ⌄</th>
              <th className="px-4 py-3">Schedule ⌄</th>
              <th className="px-4 py-3">Status ⌄</th>
              <th className="px-4 py-3">Last Run At ⌄</th>
              <th className="px-4 py-3">Date Range ⌄</th>
              <th className="px-4 py-3 text-right">Actions ⌄</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading data sources...</td></tr>
            ) : exports.map((row) => (
              <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${!row.is_active ? 'bg-blue-50/30' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-900 capitalize">{row.platform}</td>
                <td className="px-4 py-3 text-gray-500">{row.schedule}</td>
                <td className="px-4 py-3"><span className="text-green-500 border border-green-500 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]">✓</span></td>
                <td className="px-4 py-3 text-gray-500">{row.lastRun || 'Pending'}</td>
                <td className="px-4 py-3 text-gray-500">{row.date_range}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4 text-gray-400">
                    <div onClick={() => toggleActive(row)} className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${row.is_active ? 'bg-teal-600 justify-end' : 'bg-gray-300 justify-start'}`}>
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                    <span onClick={() => handleEdit(row)} className="cursor-pointer hover:text-gray-900" title="Edit Export">✏️</span>
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
