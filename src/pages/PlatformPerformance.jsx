import React from 'react';

export default function PlatformPerformance() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Platform Performance</h1>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platform</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All Platforms</option>
              <option>Meta Ads</option>
              <option>Google Ads</option>
              <option>TikTok Ads</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Funnel Stage</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All Stages</option>
              <option>TOF (Top of Funnel)</option>
              <option>MOF (Middle of Funnel)</option>
              <option>BOF (Bottom of Funnel)</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Media Type</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All Media</option>
              <option>Motion (Video)</option>
              <option>Static (Images)</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200 self-end">
          <input type="date" className="bg-transparent border-none px-2 py-1 text-sm text-gray-700 outline-none" />
          <span className="text-gray-400 text-xs font-medium">to</span>
          <input type="date" className="bg-transparent border-none px-2 py-1 text-sm text-gray-700 outline-none" />
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Spend', value: '$24,500' }, { label: 'Purchases', value: '842' },
          { label: 'CPA', value: '$29.10' }, { label: 'ROAS', value: '2.4x' },
          { label: 'Clicks', value: '45,200' }, { label: 'CTR', value: '1.8%' },
          { label: 'CPC', value: '$0.54' }, { label: 'CPM', value: '$9.20' }
        ].map((metric) => (
          <div key={metric.label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{metric.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Campaign Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-900 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-gray-200">Campaign / Ad Set</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200">Platform</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200 text-right">Spend</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200 text-right">Purchases</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200 text-right">CPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">TOF_Meta_Advantage+_Motion</div>
                  <div className="text-xs text-gray-400 mt-0.5">Top of Funnel • Video</div>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">Meta Ads</span></td>
                <td className="px-6 py-4 text-right font-medium">$8,400</td>
                <td className="px-6 py-4 text-right">210</td>
                <td className="px-6 py-4 text-right font-medium text-green-600">$40.00</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">BOF_Google_Search_Brand_Static</div>
                  <div className="text-xs text-gray-400 mt-0.5">Bottom of Funnel • Image/Text</div>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded font-medium">Google Ads</span></td>
                <td className="px-6 py-4 text-right font-medium">$3,200</td>
                <td className="px-6 py-4 text-right">180</td>
                <td className="px-6 py-4 text-right font-medium text-green-600">$17.77</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
