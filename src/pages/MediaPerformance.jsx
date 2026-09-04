import React from 'react';

export default function MediaPerformance() {
  return (
    <div className="max-w-7xl mx-auto text-gray-900 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media & Creative Performance</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze individual ad creatives, hook rates, and media efficiency.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-gray-200">Creative Asset</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200">Format</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200 text-right">Spend</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200 text-right">Thumbstop (3s)</th>
                <th className="px-6 py-4 font-bold border-b border-gray-200 text-right">Purchases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex items-center justify-center text-xl">🎬</div>
                    <div>
                      <div className="font-medium text-gray-900">UGC_Testimonial_V2.mp4</div>
                      <div className="text-xs text-gray-400 mt-0.5">Active in 3 ad sets</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded font-medium">Motion</span></td>
                <td className="px-6 py-4 text-right font-medium">$4,100</td>
                <td className="px-6 py-4 text-right">32.4%</td>
                <td className="px-6 py-4 text-right font-medium">112</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex items-center justify-center text-xl">🖼️</div>
                    <div>
                      <div className="font-medium text-gray-900">Promo_Offer_Banner.jpg</div>
                      <div className="text-xs text-gray-400 mt-0.5">Active in 1 ad set</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded font-medium">Static</span></td>
                <td className="px-6 py-4 text-right font-medium">$1,250</td>
                <td className="px-6 py-4 text-right text-gray-400">—</td>
                <td className="px-6 py-4 text-right font-medium">45</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
