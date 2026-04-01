import React from 'react';

export default function Settings() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <p className="text-gray-500">Settings page content will go here.</p>
      </div>
    </div>
  );
}
