import React, { useContext } from 'react';
import { DashboardContext } from '../context/UserDashboardContext';
import StatCard from '../components/StatCard';
const UserDashboard = () => {
  const { data } = useContext(DashboardContext);
  console.log(data)
  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Sidebar Placeholder */}
      <aside className="w-20 border-r border-gray-800 flex flex-col items-center py-8 gap-8">
        <div className="bg-white p-2 rounded-lg text-black font-bold">B</div>
        <div className="flex flex-col gap-6 text-gray-500">
          <span className="cursor-pointer hover:text-white">⊞</span>
          <span className="cursor-pointer hover:text-white">📋</span>
          <span className="cursor-pointer hover:text-white">📦</span>
          <span className="cursor-pointer hover:text-white">💬</span>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hello, {data.user}! 👋</h1>
            <p className="text-gray-500 text-sm">This is what's happening in your store this month.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-[#121212] px-4 py-2 rounded-xl border border-gray-800 text-sm">Today, Mon 22 Nov</div>
             <div className="flex items-center gap-2">
                <span className="bg-[#121212] p-2 rounded-xl border border-gray-800">🔔</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500"></div>
             </div>
          </div>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Stats */}
          <div className="col-span-3">
            <StatCard title="Total revenue" value={StatCard.totalRevenue} percentage="2.6" isWhite={true} />
          </div>
          <div className="col-span-3">
            <StatCard title="Total orders" value={StatCard.totalOrders} percentage="2" />
          </div>
          
          {/* Bar Chart Mockup */}
          <div className="col-span-6 bg-[#121212] border border-gray-800 rounded-3xl p-6">
             <div className="flex justify-between mb-4">
                <h3 className="font-medium">Revenue</h3>
                <span className="text-gray-500 text-xs">This month vs last</span>
             </div>
             <div className="flex items-end justify-between h-40 pt-4">
                {[40, 60, 85, 100, 70, 90, 80, 110].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full">
                    <div className="w-10 bg-blue-500 rounded-md" style={{ height: `${h}%` }}></div>
                    <span className="text-[10px] text-gray-500">{i + 1} AUG</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Lower Stats */}
          <div className="col-span-3">
            <StatCard title="Total visitors" value={StatCard.totalVisitors} percentage="2.6" />
          </div>
          <div className="col-span-3">
            <StatCard title="Net profit" value={StatCard.netProfit} percentage="5.6" />
          </div>

          {/* Bottom Row */}
          <div className="col-span-4 bg-[#121212] border border-gray-800 rounded-3xl p-8 relative">
            <div className="bg-gray-800/50 w-10 h-10 rounded-full flex items-center justify-center mb-10">✓</div>
            <h2 className="text-4xl font-bold">{StatCard.pendingOrders} <span className="text-lg font-normal text-gray-500">orders</span></h2>
            <p className="text-sm text-gray-500 mt-2">12 orders <span className="text-orange-400">are awaiting</span> confirmation.</p>
          </div>

          <div className="col-span-4 bg-[#121212] border border-gray-800 rounded-3xl p-8 relative">
            <div className="bg-gray-800/50 w-10 h-10 rounded-full flex items-center justify-center mb-10">👤</div>
            <h2 className="text-4xl font-bold">{StatCard.awaitingCustomers} <span className="text-lg font-normal text-gray-500">customers</span></h2>
            <p className="text-sm text-gray-500 mt-2">17 customers <span className="text-green-400">are waiting</span> for response.</p>
          </div>

          <div className="col-span-4 bg-[#121212] border border-gray-800 rounded-3xl p-6">
            <h3 className="font-medium mb-1">Sales by Category</h3>
            <p className="text-xs text-gray-500 mb-6">This month vs last</p>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full border-[10px] border-blue-500 border-t-green-500 border-r-orange-400"></div>
              <div className="flex flex-col gap-2">
                {["MacBook", "Watch", "JBL", "Divaom", "AirPods"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;