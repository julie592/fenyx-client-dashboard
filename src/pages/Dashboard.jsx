import React from 'react';

const SCORECARD_METRICS = [
  { label: 'Ad Spend', value: '$45,231' }, { label: 'Purchases', value: '1,432' },
  { label: 'CPA', value: '$31.58' }, { label: 'Clicks', value: '124,500' },
  { label: 'CTR', value: '2.4%' }, { label: 'Impressions', value: '5.1M' },
  { label: 'CPC', value: '$0.36' }, { label: 'CPM', value: '$8.86' }
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Bar: Filters & Date Range */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div className="flex gap-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
            <option>All Platforms</option>
            <option>Meta Ads</option>
            <option>Google Ads</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
            <option>Filter by Campaign...</option>
          </select>
        </div>
        <div className="flex gap-3 items-center">
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700" />
          <span className="text-gray-400 text-sm">vs</span>
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700" />
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SCORECARD_METRICS.map((metric) => (
          <div key={metric.label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{metric.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Performance by Campaign</h2>
            <div className="flex gap-2 text-sm">
              <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-medium cursor-pointer">Campaigns</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md font-medium cursor-pointer">Ad Sets</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md font-medium cursor-pointer">Ads</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 text-gray-900">
                <tr>
                  <th className="pb-3 font-semibold">Campaign Name</th>
                  <th className="pb-3 font-semibold">Spend</th>
                  <th className="pb-3 font-semibold">Purchases</th>
                  <th className="pb-3 font-semibold">CPA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100"><td className="py-3">US_Conversion_Adv+</td><td className="py-3">$12,400</td><td className="py-3">450</td><td className="py-3">$27.55</td></tr>
                <tr className="border-b border-gray-100"><td className="py-3">UK_Retargeting_Video</td><td className="py-3">$4,100</td><td className="py-3">120</td><td className="py-3">$34.16</td></tr>
                <tr className="border-b border-gray-100"><td className="py-3">CA_Search_Brand_Exact</td><td className="py-3">$3,800</td><td className="py-3">95</td><td className="py-3">$40.00</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple CSS-based Regional Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-6">Spend by Country</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700 font-medium">United States</span><span className="text-gray-900 font-bold">40%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700 font-medium">United Kingdom</span><span className="text-gray-900 font-bold">30%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700 font-medium">Canada</span><span className="text-gray-900 font-bold">20%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-400 h-2 rounded-full" style={{width: '20%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700 font-medium">Australia</span><span className="text-gray-900 font-bold">10%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-300 h-2 rounded-full" style={{width: '10%'}}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
