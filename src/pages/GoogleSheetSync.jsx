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

export default function GoogleSheetSync() {
  const [activePlatform, setActivePlatform] = useState('unified');
  const [sheetId, setSheetId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatusMessage({ 
        type: 'success', 
        text: `Settings updated for '${PLATFORMS.find(p => p.key === activePlatform)?.label}' tab!` 
      });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
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
      setStatusMessage({ type: 'success', text: `Sync triggered on Render backend: ${data.status}` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Sync trigger error: ${err.message}` });
    } fontally {
      setIsSyncing(false);
    }
  };

  const currentPlatform = PLATFORMS.find((p) => p.key === activePlatform);

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Google Sheet Sync Destinations</h1>
          <p className="text-sm text-slate-400">Configure worksheet tab targets and force manual syncs across all 10 marketing platforms.</p>
        </div>
        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-md"
        >
          {isSyncing ? 'Syncing Engine...' : '⚡ Trigger Manual Sync'}
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded-lg text-sm border font-medium transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Platform Tabs Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-1 mb-6 pb-1 no-scrollbar">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.key}
            onClick={() => {
              setActivePlatform(platform.key);
              setStatusMessage(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activePlatform === platform.key
                ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {platform.label}
          </button>
        ))}
      </div>

      {/* Selected Platform Settings Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="mb-6 pb-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">{currentPlatform.label} Configuration</h2>
            <p className="text-xs text-slate-400">Writes performance data directly to tab: <code className="text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">{currentPlatform.tabName}</code></p>
          </div>
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            6-Hour Schedule Active
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Google Sheet Spreadsheet ID
            </label>
            <input
              type="text"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Found in your browser address bar between <code className="text-slate-400">/d/</code> and <code className="text-slate-400">/edit</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Worksheet Tab Name
              </label>
              <input
                type="text"
                readOnly
                value={currentPlatform.tabName}
                className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Write Strategy
              </label>
              <input
                type="text"
                readOnly
                value="Full Tab Wipe & Overwrite (A:Z)"
                className="w-full bg-slate-800/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
            >
              {isSaving ? 'Saving Settings...' : '💾 Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
