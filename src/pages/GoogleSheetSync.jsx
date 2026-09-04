import React, { useState, useEffect } from 'react';

const DEFAULT_EXPORTS = [
  { id: 1, platform: 'Google', schedule: 'Every 6 hours starting at 12:00 am', is_active: true, lastRun: '4 Sep, 12:01 pm', date_range: '2026-09-01 until today', selected_fields: ['Date', 'Campaign Name', 'Spend', 'Impressions', 'Clicks'] }
];

export default function GoogleSheetSync() {
  const [view, setView] = useState('list');
  const [exports, setExports] = useState([]);
  const [registryFields, setRegistryFields] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [editingExport, setEditingExport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedFields, setTempSelectedFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [fieldSearch, setFieldSearch] = useState('');
  const [showDimensions, setShowDimensions] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expRes = await fetch(`${API_BASE_URL}/api/exports`);
        if (expRes.ok) {
          const expData = await expRes.json();
          setExports(expData.length > 0 ? expData : DEFAULT_EXPORTS);
        } else {
          setExports(DEFAULT_EXPORTS);
        }

        const fieldsRes = await fetch(`${API_BASE_URL}/api/fields`);
        if (fieldsRes.ok) {
          const fieldsData = await fieldsRes.json();
          setRegistryFields(fieldsData);
        }
      } catch (err) {
        console.warn('API fetch failed, using fallback UI data.');
        setExports(DEFAULT_EXPORTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (exp) => {
    setEditingExport(exp);
    setTempSelectedFields(exp.selected_fields || ['Date', 'Campaign Name', 'Spend']);
    setView('edit');
  };

  const handleCreateNew = () => {
    setEditingExport({
      id: Date.now(),
      platform: 'New Export',
      schedule: 'Every 6 hours starting at 12:00 am',
      is_active: true,
      lastRun: 'Never',
      date_range: 'Last 30 Days',
      selected_fields: ['Date', 'Campaign Name', 'Spend']
    });
    setTempSelectedFields(['Date', 'Campaign Name', 'Spend']);
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
      
      await fetch(`${API_BASE_URL}/api/exports/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
      
      setExports(prev => {
        const exists = prev.find(p => p.id === payload.id);
        if (exists) return prev.map(p => p.id === payload.id ? { ...p, ...payload, selected_fields: tempSelectedFields } : p);
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
    fetch(`${API_BASE_URL}/api/exports/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: exp.id, is_active: newStatus, date_range: exp.date_range, selected_fields: exp.selected_fields })
    }).catch(() => {});
  };

  const addField = (fieldName) => {
    if (!tempSelectedFields.includes(fieldName)) {
      setTempSelectedFields([...tempSelectedFields, fieldName]);
    }
  };

  const removeField = (fieldName) => {
    setTempSelectedFields(tempSelectedFields.filter(f => f !== fieldName));
  };

  const visibleFields = registryFields.filter(f => {
    if (!showDimensions && f.field_type === 'Dimension') return false;
    if (!showMetrics && f.field_type === 'Metric') return false;
    if (fieldSearch && !f.name.toLowerCase().includes(fieldSearch.toLowerCase())) return false;
    return true;
  });

  if (view === 'edit' && editingExport) {
    return (
      <div className="bg-gray-50 h-full p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="text-teal-600 text-xl">📊</span>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{editingExport.platform}</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setView('list')} className="px-4 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded text-sm font-medium flex items-center gap-2">
                {isSaving ? 'Saving...' : '✓ Save'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Data</h2>
            <p className="text-sm text-gray-600 mb-6">Configure the exact fields and parameters for this export destination.</p>
            
            <h3 className="text-sm font-bold text-gray-900 mb-2">Fields</h3>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 mb-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg> Choose fields
            </button>
            <p className="text-sm text-gray-600 mb-8">{tempSelectedFields.length} fields chosen</p>

            <h3 className="text-sm font-bold text-gray-900 mb-2">Export Schedule & Range</h3>
            <div className="grid grid-cols-2 gap-4 mb-2">
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Date Range</label>
                  <select value={editingExport.date_range} onChange={(e) => setEditingExport({...editingExport, date_range: e.target.value})} className="border border-gray-300 rounded px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-teal-500">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Month to Date</option>
                    <option>Year to Date</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Schedule</label>
                  <input type="text" readOnly value={editingExport.schedule} className="border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm w-full cursor-not-allowed" />
               </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Choose Fields</h2>
              </div>
              <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
                  <div className="p-3 flex gap-2 border-b border-gray-200 bg-gray-50">
                    <input type="text" placeholder="Search fields..." value={fieldSearch} onChange={e => setFieldSearch(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 outline-none focus:border-teal-500" />
                    <button onClick={() => setShowDimensions(!showDimensions)} className={`px-3 py-1.5 rounded text-sm font-medium border cursor-pointer ${showDimensions ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-300'}`}>✓ Dimensions</button>
                    <button onClick={() => setShowMetrics(!showMetrics)} className={`px-3 py-1.5 rounded text-sm font-medium border cursor-pointer ${showMetrics ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-300'}`}>✓ Metrics</button>
                  </div>
                  <div className="overflow-y-auto p-2 flex-1">
                    {registryFields.length === 0 ? (
                       <div className="p-4 text-sm text-gray-400 text-center">Loading Field Registry...</div>
                    ) : (
                      visibleFields.map(field => (
                        <div key={field.id} onClick={() => addField(field.name)} className={`flex justify-between items-center p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${tempSelectedFields.includes(field.name) ? 'opacity-50 pointer-events-none' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${field.field_type === 'Dimension' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                            <span className="text-sm font-medium text-gray-700">{field.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{field.data_type}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="w-1/2 flex flex-col bg-gray-50/30">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <span className="font-bold text-sm text-gray-900">Selected fields ({tempSelectedFields.length})</span>
                    <span onClick={() => setTempSelectedFields([])} className="text-gray-400 hover:text-red-500 cursor-pointer text-sm font-medium">Clear All</span>
                  </div>
                  <div className="overflow-y-auto p-2 flex-1">
                    {tempSelectedFields.map((fieldName, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-white border-b border-gray-100 bg-white shadow-sm mb-1 rounded border">
                        <span className="text-sm text-gray-900 font-medium">:: {fieldName}</span>
                        <button onClick={() => removeField(fieldName)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 cursor-pointer">✓ Use these fields</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exports</h1>
        <button onClick={handleCreateNew} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          + Create Export
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Destination ⌄</th>
              <th className="px-4 py-3">Schedule ⌄</th>
              <th className="px-4 py-3">Status ⌄</th>
              <th className="px-4 py-3">Date Range ⌄</th>
              <th className="px-4 py-3 text-right">Actions ⌄</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading exports...</td></tr>
            ) : exports.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{row.platform}</td>
                <td className="px-4 py-3 text-gray-500">{row.schedule}</td>
                <td className="px-4 py-3"><span className="text-green-500 border border-green-500 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]">✓</span></td>
                <td className="px-4 py-3 text-gray-500">{row.date_range}</td>
                <td className="px-4 py-3 text-right">
                  <span onClick={() => handleEdit(row)} className="cursor-pointer text-teal-600 hover:text-teal-800 font-medium">Edit</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
