import React, { useState, useEffect } from 'react';

export default function GoogleSheetSync() {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningExportId, setRunningExportId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchExports = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/exports`);
      if (res.ok) {
        const data = await res.json();
        setExports(data);
      }
    } catch (err) {
      console.error('Failed to fetch exports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleRunNow = async (exportId, platformName) => {
    setRunningExportId(exportId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/exports/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ export_id: exportId })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`SUCCESS: Export executed for ${platformName || 'Data Source'}!\n\nRows Extracted: ${data.rows_exported}\nDate Window: ${data.date_window.start} to ${data.date_window.end}`);
        fetchExports();
      } else {
        alert(`EXPORT FAILED: ${data.error}`);
      }
    } catch (err) {
      alert('Network error executing export.');
    } finally {
      setRunningExportId(null);
    }
  };

  return (
    <div className="bg-white h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exports</h1>
          <p className="text-sm text-gray-500 mt-1">Manage automated background syncs to Google Sheets destinations.</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Destination / Platform</th>
              <th className="px-6 py-4">Schedule</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date Window</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading export engine jobs...</td></tr>
            ) : exports.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No export configurations found in database.</td></tr>
            ) : exports.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900 capitalize">{row.platform || row.platform_key}</td>
                <td className="px-6 py-4 text-gray-500">{row.schedule || 'Every 6 hours'}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1.5 w-max">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{row.date_range || 'Last 30 Days'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleRunNow(row.id, row.platform)}
                    disabled={runningExportId === row.id}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    {runningExportId === row.id ? 'Running Engine...' : '⚡ Run Export'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
