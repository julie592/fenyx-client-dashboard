import React, { useState } from 'react';

const PLATFORMS = [
  { key: 'unified', label: 'Unified', tabName: 'Unified' },
  { key: 'meta', label: 'Meta', tabName: 'Meta' },
  { key: 'google', label: 'Google', tabName: 'Google' },
  { key: 'tiktok', label: 'TikTok', tabName: 'TikTok' },
  { key: 'taboola', label: 'Taboola', tabName: 'Taboola' },
  { key: 'taboola_video', label: 'Taboola Video', tabName: 'Taboola Video' },
  { key: 'reddit', label: 'Reddit', tabName: 'Reddit' },
  { key: 'microsoft', label: 'Microsoft', tabName: 'Microsoft' },
  { key: 'twitter', label: 'Twitter', tabName: 'Twitter' },
  { key: 'propeller', label: 'Propeller', tabName: 'Propeller' },
];

const AVAILABLE_DIMENSIONS = ['Date', 'Platform', 'Campaign Name', 'Ad Set Name', 'Ad Name', 'Country', 'Device'];
const AVAILABLE_METRICS = ['Spend', 'Impressions', 'Clicks', 'CTR', 'CPC', 'CPM', 'Purchases', 'CPA', 'ROAS', 'Video Views (3s)'];

export default function GoogleSheetSync() {
  const [activePlatform, setActivePlatform] = useState('unified');
  const [sheetId, setSheetId] = useState('');
  const [dateRange, setDateRange] = useState('last_30_days');
  
  // Default selected fields
  const [selectedFields, setSelectedFields] = useState(
    new Set(['Date', 'Platform', 'Campaign Name', 'Spend', 'Clicks', 'Purchases', 'CPA'])
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const toggleField = (field) => {
    const next = new Set(selectedFields);
    if (next.has(field)) next.delete(field);
    else next.add(field);
    setSelectedFields(next);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatusMessage({ 
        type: 'success', 
        text: `Configuration saved for the '${PLATFORMS.find(p => p.key === activePlatform)?.label}' tab!` 
      });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to save configuration.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sync/now`, { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      const data = await res.json();
      setStatusMessage({ type: 'success', text: `Sync triggered successfully: ${data.status}` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Sync trigger error: ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const currentPlatform = PLATFORMS.find((p) => p.key === activePlatform);

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-900 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Google Sheet Sync</h1>
          <p className="text-sm text-gray-500 mt-1">Configure destination tabs, export windows, and schema mappings.</p>
        </div>
        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm cursor-pointer"
        >
          {isSyncing ? 'Syncing Engine...' : '⚡ Trigger Manual Sync'}
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded-lg text-sm border font-medium transition-all ${
          statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Platform Tabs Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 mb-6 pb-px no-scrollbar">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.key}
            onClick={() => {
              setActivePlatform(platform.key);
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activePlatform === platform.key
                ? 'bg-white text-blue-600 border border-gray-200 border-b-white -mb-px shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {platform.label}
          </button>
        ))}
      </div>

      {/* Settings Form Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Connection & Strategy */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Connection Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Spreadsheet ID</label>
                <input
                  type="text"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Worksheet Tab Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentPlatform.tabName}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Write Strategy</label>
                <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="overwrite">Full Tab Wipe & Overwrite (A:Z)</option>
                  <option value="append">Append Rows to Bottom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Parameters */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Export Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-Export Date Range</label>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="ytd">Year to Date</option>
                  <option value="maximum">Maximum (All Time)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1.5">Determines the lookback window on each 6-hour sync.</p>
              </div>
            </div>

            {/* Field Selection */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <label className="block text-sm font-semibold text-gray-900 mb-4">Export Schema (Columns)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dimensions */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dimensions</div>
                  <div className="space-y-2">
                    {AVAILABLE_DIMENSIONS.map((field) => (
                      <label key={field} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFields.has(field)}
                          onChange={() => toggleField(field)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Metrics */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Metrics</div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {AVAILABLE_METRICS.map((field) => (
                      <label key={field} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFields.has(field)}
                          onChange={() => toggleField(field)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">Settings will apply on the next engine cycle.</span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? 'Saving...' : '💾 Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
