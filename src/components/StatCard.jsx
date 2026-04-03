import React from 'react'

const StatCard = ({ title, value, percentage, isWhite = false, footer }) => {
  const bgColor = isWhite ? 'bg-white' : 'bg-[#121212] border border-gray-800';
  const textColor = isWhite ? 'text-gray-900' : 'text-white';
  const labelColor = isWhite ? 'text-gray-500' : 'text-gray-400';
  return (
    <div className={`p-6 rounded-3xl ${bgColor} flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${labelColor}`}>{title}</span>
        <div className={`p-2 rounded-full border ${isWhite ? 'border-gray-200' : 'border-gray-700'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h2 className={`text-3xl font-bold ${textColor}`}>
            {typeof value === 'number' ? `$ ${value.toLocaleString()}` : value}
          </h2>
          {percentage && (
            <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
              ↑ {percentage}%
            </span>
          )}
        </div>
        <p className={`text-xs mt-1 ${labelColor}`}>This month vs last</p>
      </div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-800">{footer}</div>}
    </div>
  );
};

export default StatCard
