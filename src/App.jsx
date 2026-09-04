import React, { useState, useMemo } from 'react';
import { 
  Share2, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight,
  MoveUp, MoveDown, Check, Copy, Video, Plus, CheckCircle, 
  AlertCircle, Clock, Trash2, Search, X, Sliders, Key, Globe, ShieldCheck,
  TrendingUp, BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, CartesianGrid 
} from 'recharts';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [dashSubTab, setDashSubTab] = useState('All Platforms');
  
  // Workspace State
  const [workspaces, setWorkspaces] = useState(['ATF (Apex Trader)']);
  const [workspace, setWorkspace] = useState('ATF (Apex Trader)');
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWorkspaceInput, setNewWorkspaceInput] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncFreq, setSyncFreq] = useState('6h');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [sortField, setSortField] = useState('spend');
  const [sortDir, setSortDir] = useState('desc');

  // Trend & Visual Data
  const trendData = [
    { date: 'Aug 29', spend: 5200, revenue: 18400, purchases: 380 },
    { date: 'Aug 30', spend: 6100, revenue: 22100, purchases: 440 },
    { date: 'Aug 31', spend: 5800, revenue: 20500, purchases: 410 },
    { date: 'Sep 01', spend: 7400, revenue: 28900, purchases: 590 },
    { date: 'Sep 02', spend: 8200, revenue: 31200, purchases: 630 },
    { date: 'Sep 03', spend: 7600, revenue: 29400, purchases: 510 },
    { date: 'Sep 04', spend: 7950, revenue: 30500, purchases: 460 },
  ];

  const channelBreakdownData = [
    { channel: 'Meta', spend: 14200, revenue: 52100 },
    { channel: 'Google', spend: 12100, revenue: 48900 },
    { channel: 'TikTok', spend: 8900, revenue: 28400 },
    { channel: 'Reddit', spend: 5400, revenue: 14200 },
    { channel: 'MSFT', spend: 4600, revenue: 13800 },
    { channel: 'Propeller', spend: 3050, revenue: 8100 },
  ];

  // Google Sheets Sync State
  const [selectedSheetPlatform, setSelectedSheetPlatform] = useState('Unified');
  const [platformDateRanges, setPlatformDateRanges] = useState({
    'Unified': 'Rolling 7 Days (Attribution Lookback)',
    'Meta': 'Rolling 7 Days (Attribution Lookback)',
    'TikTok': 'Rolling 14 Days',
    'Google Search': 'Rolling 7 Days (Attribution Lookback)',
    'Google Display': 'Rolling 30 Days',
    'Reddit': 'Month to Date (MTD)'
  });

  const [activeColumns, setActiveColumns] = useState([
    { id: '1', key: 'date', label: 'Date', category: 'Dimension', alias: 'Date' },
    { id: '2', key: 'platform', label: 'Platform', category: 'Dimension', alias: 'Traffic Source' },
    { id: '3', key: 'campaign', label: 'Campaign', category: 'Dimension', alias: 'Campaign Name' },
    { id: '4', key: 'spend', label: 'Spend', category: 'Metric', alias: 'Cost ($)' },
    { id: '5', key: 'clicks', label: 'Clicks', category: 'Metric', alias: 'Clicks' },
    { id: '6', key: 'purchases', label: 'Purchases', category: 'Metric', alias: 'Conversions' },
    { id: '7', key: 'cpa', label: 'CPA', category: 'Metric', alias: 'Cost / Conv ($)' }
  ]);

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [fieldSearchQuery, setFieldSearchQuery] = useState('');

  const availableFields = [
    { label: 'Ad ID', category: 'Dimension', defaultAlias: 'Ad ID' },
    { label: 'Ad Name', category: 'Dimension', defaultAlias: 'Ad Name' },
    { label: 'Ad Group', category: 'Dimension', defaultAlias: 'Ad Group Name' },
    { label: 'Country', category: 'Dimension', defaultAlias: 'Geo / Country' },
    { label: 'Impressions', category: 'Metric', defaultAlias: 'Impressions' },
    { label: 'ROAS', category: 'Metric', defaultAlias: 'ROAS' },
    { label: 'Conversion Value', category: 'Metric', defaultAlias: 'Revenue ($)' },
    { label: 'Video Views (25%)', category: 'Metric', defaultAlias: 'Video 25%' },
    { label: 'Video Views (100%)', category: 'Metric', defaultAlias: 'Video Completes' },
    { label: 'CPCV', category: 'Metric', defaultAlias: 'Cost per Completed View' }
  ];

  const [selectedConfigPlatform, setSelectedConfigPlatform] = useState(null);
  const [dataSources] = useState([
    { id: 'meta', name: 'Meta Ads', account: 'act_10203040', status: 'Connected', lastSync: '12 mins ago', appId: 'meta_app_99182' },
    { id: 'google_search', name: 'Google Search', account: '982-104-5512', status: 'Connected', lastSync: '12 mins ago', appId: 'mcc_881920' },
    { id: 'google_display', name: 'Google Display', account: '982-104-5512', status: 'Connected', lastSync: '12 mins ago', appId: 'mcc_881920' },
    { id: 'tiktok', name: 'TikTok Ads', account: '69102488102', status: 'Connected', lastSync: '28 mins ago', appId: 'tt_app_44102' },
    { id: 'reddit', name: 'Reddit Ads', account: 'a881920_apex', status: 'Connected', lastSync: '1 hour ago', appId: 'rd_client_1102' },
    { id: 'microsoft', name: 'Microsoft / Bing', account: 'MS_9021882', status: 'Connected', lastSync: '2 hours ago', appId: 'msft_pub_3391' },
    { id: 'propeller', name: 'PropellerAds', account: 'PRP_441920', status: 'Action Required', lastSync: 'Requires Token Refresh', appId: 'prp_api_9011' }
  ]);

  const [settings, setSettings] = useState({
    timezone: '(UTC-05:00) Eastern Time (US & Canada)',
    attributionWindow: '7-Day Click / 1-Day View (Recommended)',
    currency: 'USD ($)',
    webhookUrl: 'https://api.fenyx.app/v1/webhooks/atf-workspace',
    autoReauth: true
  });

  const kpis = [
    { title: 'Total Spend', value: '$48,250.00', change: '+12.4%', positive: false },
    { title: 'Impressions', value: '4,850,200', change: '+18.2%', positive: true },
    { title: 'Clicks', value: '142,800', change: '+8.5%', positive: true },
    { title: 'Avg. CPC', value: '$0.34', change: '-3.6%', positive: true },
    { title: 'Avg. CPM', value: '$9.95', change: '-4.8%', positive: true },
    { title: 'Avg. CTR', value: '2.94%', change: '+0.4%', positive: true },
    { title: 'Purchases', value: '3,420', change: '+14.1%', positive: true },
    { title: 'Avg. CPA', value: '$14.11', change: '-1.5%', positive: true }
  ];

  const campaignData = [
    { id: 1, name: 'ATF_Meta_AdvantagePlus_US', source: 'Meta', spend: 14200, clicks: 42100, purchases: 1050, cpa: 13.52, ctr: 3.12 },
    { id: 2, name: 'ATF_Google_Search_Brand_US', source: 'Google', spend: 12100, clicks: 38900, purchases: 980, cpa: 12.35, ctr: 4.85 },
    { id: 3, name: 'ATF_TikTok_Spark_GenZ', source: 'TikTok', spend: 8900, clicks: 28400, purchases: 540, cpa: 16.48, ctr: 2.15 },
    { id: 4, name: 'ATF_Reddit_TechSubreddits', source: 'Reddit', spend: 5400, clicks: 14200, purchases: 320, cpa: 16.88, ctr: 1.85 },
    { id: 5, name: 'ATF_MSFT_BingSearch_Intent', source: 'Microsoft', spend: 4600, clicks: 11200, purchases: 310, cpa: 14.84, ctr: 3.42 },
    { id: 6, name: 'ATF_Propeller_Push_Global', source: 'Propeller', spend: 3050, clicks: 8000, purchases: 220, cpa: 13.86, ctr: 1.45 }
  ];

  const adData = [
    { id: 101, name: 'Ad_Creative_Video_UGC_01.mp4', campaign: 'ATF_Meta_AdvantagePlus_US', source: 'Meta', spend: 6800, clicks: 21000, purchases: 510, cpa: 13.33 },
    { id: 102, name: 'Ad_Static_Carousels_Offer.jpg', campaign: 'ATF_Meta_AdvantagePlus_US', source: 'Meta', spend: 7400, clicks: 21100, purchases: 540, cpa: 13.70 },
    { id: 103, name: 'Search_RSA_ExactMatch_Brand', campaign: 'ATF_Google_Search_Brand_US', source: 'Google', spend: 12100, clicks: 38900, purchases: 980, cpa: 12.35 },
    { id: 104, name: 'TikTok_Spark_InfluencerHook_A', campaign: 'ATF_TikTok_Spark_GenZ', source: 'TikTok', spend: 8900, clicks: 28400, purchases: 540, cpa: 16.48 }
  ];

  const handleWorkspaceSelect = (e) => {
    const val = e.target.value;
    if (val === 'ADD_NEW_WORKSPACE') {
      setShowNewWorkspaceModal(true);
    } else {
      setWorkspace(val);
    }
  };

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (newWorkspaceInput.trim()) {
      const name = newWorkspaceInput.trim();
      setWorkspaces([...workspaces, name]);
      setWorkspace(name);
      setNewWorkspaceInput('');
      setShowNewWorkspaceModal(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filteredCampaigns = useMemo(() => {
    let list = [...campaignData];
    if (dashSubTab !== 'All Platforms' && dashSubTab !== 'Video Performance') {
      list = list.filter(c => c.source.toLowerCase() === dashSubTab.toLowerCase());
    }
    return list.sort((a, b) => {
      const valA = a[sortField] || 0;
      const valB = b[sortField] || 0;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
  }, [dashSubTab, sortField, sortDir]);

  const filteredAds = useMemo(() => {
    let list = [...adData];
    if (dashSubTab !== 'All Platforms' && dashSubTab !== 'Video Performance') {
      list = list.filter(a => a.source.toLowerCase() === dashSubTab.toLowerCase());
    }
    return list;
  }, [dashSubTab]);

  const moveColumn = (index, direction) => {
    const newCols = [...activeColumns];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCols.length) return;
    const temp = newCols[index];
    newCols[index] = newCols[targetIdx];
    newCols[targetIdx] = temp;
    setActiveColumns(newCols);
  };

  const removeColumn = (index) => {
    setActiveColumns(activeColumns.filter((_, i) => i !== index));
  };

  const handleAddField = (field) => {
    const newCol = {
      id: Date.now().toString(),
      key: field.label.toLowerCase().replace(/ /g, '_'),
      label: field.label,
      category: field.category,
      alias: field.defaultAlias
    };
    setActiveColumns([...activeColumns, newCol]);
    setShowAddFieldModal(false);
    setFieldSearchQuery('');
  };

  const filteredFields = availableFields.filter(f => 
    f.label.toLowerCase().includes(fieldSearchQuery.toLowerCase()) || 
    f.category.toLowerCase().includes(fieldSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">fenyx</span>
            </div>

            {/* Workspace Selector Dropdown */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Workspace:</span>
              <select 
                value={workspace} 
                onChange={handleWorkspaceSelect}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                {workspaces.map((ws) => (
                  <option key={ws} value={ws}>{ws}</option>
                ))}
                <option value="ADD_NEW_WORKSPACE">+ Add New Workspace</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <RefreshCw className="w-3 h-3 animate-spin" /> 6-Hour Auto Sync Active
            </span>
            <button 
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              <Share2 className="w-4 h-4" /> Share Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex gap-6 border-t border-slate-100 text-sm font-medium text-slate-600">
          {[
            { id: 'Dashboard', label: 'Dashboard' },
            { id: 'Google Sheets Sync', label: 'Google Sheets Sync' },
            { id: 'Data Sources', label: 'Data Sources & APIs' },
            { id: 'Settings', label: 'Workspace Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 font-semibold' 
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                {['All Platforms', 'Video Performance', 'Google', 'TikTok', 'Meta', 'Reddit', 'Microsoft', 'Propeller'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setDashSubTab(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      dashSubTab === sub ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <select className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>Last 14 Days</option>
                    <option>Last 30 Days</option>
                    <option>Month to Date</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 8 Primary KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
                  <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</div>
                  <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${kpi.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {kpi.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{kpi.change} vs prev 7d</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Recharts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" /> Daily Spend vs Return
                    </h3>
                    <p className="text-xs text-slate-500">Cross-channel aggregated performance for {workspace}</p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={2} />
                      <Area type="monotone" dataKey="spend" name="Spend ($)" stroke="#0284c7" fill="#bae6fd" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-600" /> Channel Revenue Contribution
                  </h3>
                  <p className="text-xs text-slate-500">Gross revenue generated per traffic source</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelBreakdownData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis dataKey="channel" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Campaign Level Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Campaign Performance ({dashSubTab})</h3>
                  <p className="text-xs text-slate-500">Multi-touch attribution grouped by campaign parameters</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{filteredCampaigns.length} campaigns</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="p-3.5">Campaign Name</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => handleSort('spend')}>
                        Spend {sortField === 'spend' && (sortDir === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => handleSort('clicks')}>
                        Clicks {sortField === 'clicks' && (sortDir === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => handleSort('ctr')}>
                        CTR {sortField === 'ctr' && (sortDir === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => handleSort('purchases')}>
                        Purchases {sortField === 'purchases' && (sortDir === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => handleSort('cpa')}>
                        CPA {sortField === 'cpa' && (sortDir === 'asc' ? '▲' : '▼')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredCampaigns.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-medium text-slate-900">{row.name}</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">{row.source}</span></td>
                        <td className="p-3.5 font-semibold text-slate-900">${row.spend.toLocaleString()}</td>
                        <td className="p-3.5">{row.clicks.toLocaleString()}</td>
                        <td className="p-3.5">{row.ctr}%</td>
                        <td className="p-3.5 font-semibold text-emerald-700">{row.purchases}</td>
                        <td className="p-3.5">${row.cpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ad & Creative Level Breakdown Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Ad & Creative Drill-Down ({dashSubTab})</h3>
                  <p className="text-xs text-slate-500">Individual ad creative performance and conversion attribution</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{filteredAds.length} creative units</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="p-3.5">Ad Creative Name</th>
                      <th className="p-3.5">Parent Campaign</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5">Spend</th>
                      <th className="p-3.5">Clicks</th>
                      <th className="p-3.5">Purchases</th>
                      <th className="p-3.5">CPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredAds.map((ad) => (
                      <tr key={ad.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-medium text-indigo-600">{ad.name}</td>
                        <td className="p-3.5 text-slate-500">{ad.campaign}</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">{ad.source}</span></td>
                        <td className="p-3.5 font-semibold text-slate-900">${ad.spend.toLocaleString()}</td>
                        <td className="p-3.5">{ad.clicks.toLocaleString()}</td>
                        <td className="p-3.5 font-semibold text-emerald-700">{ad.purchases}</td>
                        <td className="p-3.5">${ad.cpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* GOOGLE SHEETS SYNC TAB */}
        {activeTab === 'Google Sheets Sync' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Google Sheets Sync Engine & Field Organizer</h2>
                  <p className="text-xs text-slate-500">Configure exact column sequence, header aliases, and export schedules (Funnel.io style)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Auto-Sync Schedule:
                  </span>
                  <select 
                    value={syncFreq} 
                    onChange={(e) => setSyncFreq(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="6h">Every 6 Hours (12am • 6am • 12pm • 6pm)</option>
                    <option value="12h">Every 12 Hours</option>
                    <option value="24h">Daily (24 Hours)</option>
                  </select>
                </div>
              </div>

              <div className="flex border-b border-slate-200 gap-2">
                {['Unified', 'Meta', 'TikTok', 'Google Search', 'Google Display', 'Reddit'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedSheetPlatform(p)}
                    className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                      selectedSheetPlatform === p ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {p} Rules
                  </button>
                ))}
              </div>

              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950">Auto-Push Date Window for {selectedSheetPlatform}</span>
                  </div>
                  <p className="text-[11px] text-indigo-700/80">
                    Defines how far back the 6-hour automated sync worker re-aggregates data to capture delayed ad conversions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-900 font-medium">Auto Export Range:</span>
                  <select 
                    value={platformDateRanges[selectedSheetPlatform] || 'Rolling 7 Days (Attribution Lookback)'} 
                    onChange={(e) => setPlatformDateRanges(prev => ({ ...prev, [selectedSheetPlatform]: e.target.value }))}
                    className="bg-white border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-900 shadow-sm outline-none cursor-pointer"
                  >
                    <option value="Rolling 7 Days (Attribution Lookback)">Rolling 7 Days (Attribution Lookback)</option>
                    <option value="Rolling 14 Days">Rolling 14 Days</option>
                    <option value="Rolling 30 Days">Rolling 30 Days</option>
                    <option value="Month to Date (MTD)">Month to Date (MTD)</option>
                    <option value="Yesterday Only (Fast Upsert)">Yesterday Only (Fast Upsert)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Active Output Sheet Columns ({activeColumns.length})
                </h4>
                <div className="space-y-2">
                  {activeColumns.map((col, index) => (
                    <div key={col.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-mono text-slate-400 font-bold">{String.fromCharCode(65 + index)}</span>
                        <div>
                          <span className="font-semibold text-slate-900">{col.label}</span>
                          <span className="ml-2 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{col.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-2">
                          <span className="text-slate-400">Header Alias:</span>
                          <input 
                            type="text" 
                            value={col.alias} 
                            onChange={(e) => {
                              const updated = [...activeColumns];
                              updated[index].alias = e.target.value;
                              setActiveColumns(updated);
                            }}
                            className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-mono text-slate-800 focus:border-indigo-500 outline-none"
                          />
                        </div>
                        
                        <div className="flex items-center border-l border-slate-200 pl-2 gap-1">
                          <button 
                            onClick={() => moveColumn(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30 transition"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => moveColumn(index, 'down')}
                            disabled={index === activeColumns.length - 1}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30 transition"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => removeColumn(index)}
                            className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400 ml-1 transition"
                            title="Remove Field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowAddFieldModal(true)}
                  className="w-full mt-2 py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Dimension or Metric
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Live Output Preview Grid</h4>
                  <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Sync Window: {platformDateRanges[selectedSheetPlatform] || 'Rolling 7 Days'}
                  </span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-900 border-b border-emerald-200 font-mono font-semibold">
                        {activeColumns.map((col, idx) => (
                          <th key={col.id} className="p-2.5 border-r border-emerald-200 whitespace-nowrap">
                            {String.fromCharCode(65 + idx)}: {col.alias}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700 text-[11px]">
                      <tr>
                        {activeColumns.map((col, idx) => (
                          <td key={idx} className="p-2 border-r whitespace-nowrap">
                            {col.category === 'Metric' ? '123' : 'Sample_Data'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DATA SOURCES TAB */}
        {activeTab === 'Data Sources' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Connected Media Integrations & API Vault</h2>
                  <p className="text-xs text-slate-500">Manage OAuth credentials, account IDs, and sync statuses for workspace: <strong>{workspace}</strong></p>
                </div>
                <button className="bg-indigo-600 text-white text-xs px-3.5 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-1.5 transition">
                  <Plus className="w-3.5 h-3.5" /> Connect New Platform
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {dataSources.map((ds) => (
                  <div key={ds.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ds.name}</span>
                        {ds.status === 'Connected' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            <AlertCircle className="w-3 h-3" /> Token Expired
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">Account ID: {ds.account}</div>
                      <div className="text-[10px] text-slate-400">Last Synced: {ds.lastSync}</div>
                    </div>

                    <button 
                      onClick={() => setSelectedConfigPlatform(ds)}
                      className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-100 transition shadow-sm hover:border-indigo-300 hover:text-indigo-600"
                    >
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'Settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Workspace Configurations — {workspace}</h2>
                <p className="text-xs text-slate-500">Configure global timezones, attribution rules, and automated re-authorization preferences.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> Default Workspace Timezone
                  </label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  >
                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                    <option>(UTC+00:00) Greenwich Mean Time (London)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" /> Attribution Lookback Window
                  </label>
                  <select 
                    value={settings.attributionWindow}
                    onChange={(e) => setSettings({...settings, attributionWindow: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  >
                    <option>7-Day Click / 1-Day View (Recommended)</option>
                    <option>1-Day Click Only</option>
                    <option>28-Day Click / 7-Day View</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" /> Webhook Output Endpoint
                  </label>
                  <input 
                    type="text" 
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Automated OAuth Refresh Engine
                  </label>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Auto-renew tokens before expiration</span>
                    <input 
                      type="checkbox" 
                      checked={settings.autoReauth}
                      onChange={(e) => setSettings({...settings, autoReauth: e.target.checked})}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => alert('Workspace settings saved successfully!')}
                  className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Save Workspace Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE NEW WORKSPACE MODAL */}
      {showNewWorkspaceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateWorkspace} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Create New Workspace</h3>
              <button type="button" onClick={() => setShowNewWorkspaceModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-500">Add a workspace to segregate API integrations, ad accounts, and Google Sheets exports.</p>
            <input 
              type="text" 
              placeholder="e.g. ATF International" 
              value={newWorkspaceInput} 
              onChange={(e) => setNewWorkspaceInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowNewWorkspaceModal(false)} 
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FIELD CATALOG MODAL */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Add Field to Google Sheets Sync</h3>
              <button onClick={() => setShowAddFieldModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search dimensions & metrics (e.g. 'ROAS', 'Video Views')..." 
                  value={fieldSearchQuery}
                  onChange={(e) => setFieldSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto p-2">
              {filteredFields.length > 0 ? (
                <div className="space-y-1">
                  {filteredFields.map((field, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAddField(field)}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center justify-between group transition"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                          {field.label}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600">
                            {field.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Default Column Alias: <span className="font-mono">{field.defaultAlias}</span></div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No fields match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM CONFIGURATION MODAL */}
      {selectedConfigPlatform && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Configure {selectedConfigPlatform.name} API</h3>
              <button onClick={() => setSelectedConfigPlatform(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-600">Ad Account ID</label>
                <input type="text" readOnly value={selectedConfigPlatform.account} className="w-full mt-1 p-2 bg-slate-100 border rounded font-mono text-slate-700 outline-none" />
              </div>
              <div>
                <label className="font-medium text-slate-600">OAuth Client App ID</label>
                <input type="text" readOnly value={selectedConfigPlatform.appId} className="w-full mt-1 p-2 bg-slate-100 border rounded font-mono text-slate-700 outline-none" />
              </div>
              <div>
                <label className="font-medium text-slate-600">Attribution Mapping</label>
                <div className="p-2 bg-slate-50 border rounded text-slate-600 mt-1">
                  CTA (Click-Through) & VTA (View-Through) metrics active.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedConfigPlatform(null)} 
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded hover:bg-slate-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert(`Re-authenticating ${selectedConfigPlatform.name} via OAuth 2.0...`);
                  setSelectedConfigPlatform(null);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Re-authenticate OAuth
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Share Stakeholder Link</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <input 
                type="text" 
                readOnly 
                value={`https://fenyx.app/share/${workspace.toLowerCase().replace(/[^a-z0-9]/g, '')}-live-report?token=fx_982a1`} 
                className="bg-transparent text-xs font-mono text-slate-700 w-full outline-none"
              />
              <button 
                onClick={() => {
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700 transition shrink-0"
              >
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
