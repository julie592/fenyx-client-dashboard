import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workspace Settings</h1>
      </div>

      <div className="border-b border-gray-200 mb-6 flex gap-6">
        <button onClick={() => setActiveTab('users')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-900'}`}>
          User Management
        </button>
        <button onClick={() => setActiveTab('security')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'security' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-900'}`}>
          Security & SSO
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Users</h2>
              <p className="text-sm text-gray-500 mt-1">Manage who has access to this workspace and their permissions.</p>
            </div>
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-medium transition-colors">
              + Invite User
            </button>
          </div>
          
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Authentication</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Admin User</td>
                <td className="px-6 py-4 text-gray-500">admin@fenyx.io</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">Owner</span></td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google SSO
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-400">⋮</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Authentication Settings</h2>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-bold text-gray-900">Require Google Single Sign-On (SSO)</div>
              <div className="text-sm text-gray-500 mt-1">Force all invited workspace users to authenticate via Google.</div>
            </div>
            <div className="w-10 h-5 bg-teal-600 rounded-full flex items-center justify-end p-0.5 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
