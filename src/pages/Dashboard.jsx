import { useContext, useState, useMemo, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import { DashBoardContext } from "../context/DashboardContext";
import { Plus, Search, LayoutDashboard, ListOrdered, TrendingUp, ShieldCheck, Eye, Sun, Moon, Menu, X } from "lucide-react";

const MetricCard = ({ title, value, percentage, isWhite = false, showCurrency = true }) => {
  const bgColor = isWhite ? 'bg-white' : 'bg-[#121212] border border-gray-800';
  const textColor = isWhite ? 'text-gray-900' : 'text-white';
  const labelColor = isWhite ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`p-5 md:p-6 rounded-3xl ${bgColor} flex flex-col justify-between h-36 md:h-40 transition-all shadow-lg card-theme`}>
      <div className="flex justify-between items-start">
        <span className={`text-xs md:text-sm font-medium ${labelColor}`}>{title}</span>
        <div className={`p-1.5 rounded-full border ${isWhite ? 'border-gray-200' : 'border-gray-700'}`}>
          <Plus size={12} className="rotate-45" />
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className={`text-2xl md:text-3xl font-bold ${textColor}`}>
             {/* FIXED LOGIC BELOW */}
             {typeof value === 'number' 
               ? (showCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()) 
               : value}
          </h2>
          <span className="bg-green-900/30 text-green-400 text-[9px] md:text-[10px] px-2 py-1 rounded-full whitespace-nowrap">↑ {percentage}%</span>
        </div>
        <p className={`text-[9px] md:text-[10px] mt-1 ${labelColor}`}>This month vs last</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [toggle, setToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle
  
  const [userMode, setUserMode] = useState(() => {
    try { return localStorage.getItem("userMode") || "admin"; } catch { return "admin"; }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("darkMode");
      return savedTheme !== null ? JSON.parse(savedTheme) : true;
    } catch { return true; }
  });

  const [hoveredTx, setHoveredTx] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null); 

  useEffect(() => { localStorage.setItem("userMode", userMode); }, [userMode]);
  useEffect(() => { localStorage.setItem("darkMode", JSON.stringify(darkMode)); }, [darkMode]);

  const { Transactions, DeleteFunction, setEditUser } = useContext(DashBoardContext);

  const dynamicData = useMemo(() => {
    const individualData = Transactions.map((t, i) => ({
      ...t,
      displayPrice: Number(t.price || t.amount) || 0,
      index: i
    }));
    const maxPrice = Math.max(...individualData.map(d => d.displayPrice), 1);
    const width = 800; 
    const height = 150;
    const points = individualData.map((d, i) => {
      const x = (i / (individualData.length - 1 || 1)) * width;
      const y = height - (d.displayPrice / maxPrice) * height;
      return `${x},${y}`;
    }).join(" ");

    const catMap = Transactions.reduce((acc, curr) => {
      const cat = curr.category || "Other";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const totalOrders = Transactions.length || 1;
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    const pieData = Object.entries(catMap).map(([name, count], i) => ({
      name, count, percent: (count / totalOrders) * 100, color: colors[i % colors.length]
    }));

    return { 
      revenue: Transactions.reduce((a, b) => a + (Number(b.price || b.amount) || 0), 0),
      individualData, maxPrice, points, pieData, totalOrders,
      statusCounts: {
        new: Transactions.filter(t => t.status === "new").length,
        await: Transactions.filter(t => t.status === "await").length,
        onway: Transactions.filter(t => t.status === "on way").length,
        delivered: Transactions.filter(t => t.status === "delivered").length,
      }
    };
  }, [Transactions]);

  const filteredTransactions = Transactions.filter(t =>
    t.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.orderNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#080808] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {!darkMode && (
        <style>{`
          .card-theme { background-color: white !important; border-color: #e5e7eb !important; color: #111827 !important; }
          .bg-\\[\\#121212\\] { background-color: white !important; border-color: #e5e7eb !important; }
          .text-white { color: #111827 !important; }
          .text-gray-400 { color: #6b7280 !important; }
          .border-gray-800 { border-color: #e5e7eb !important; }
          .bg-black { background-color: #f9fafb !important; border-color: #d1d5db !important; color: #111827 !important; }
        `}</style>
      )}

      <div className="p-4 md:px-12 lg:px-16 font-sans max-w-[1920px] mx-auto">
        {/* RESPONSIVE HEADER */}
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8 md:mb-10">
          <div className="flex justify-between items-center w-full lg:w-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Hello, User! 👋</h1>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
                Status: <span className={userMode === "admin" ? "text-red-500" : "text-blue-500"}>{userMode}</span>
              </p>
            </div>
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 bg-[#121212] border border-gray-800 rounded-xl">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col md:flex-row items-stretch md:items-center gap-4 transition-all`}>
            <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => setDarkMode(!darkMode)} className={`flex-1 md:flex-none p-2 rounded-xl border transition-all flex justify-center ${darkMode ? 'bg-[#121212] border-gray-800 text-yellow-400' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}>
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => setUserMode(userMode === "admin" ? "viewer" : "admin")} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#121212] border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-all">
                  {userMode === "admin" ? <ShieldCheck size={16} className="text-red-400" /> : <Eye size={16} className="text-blue-400" />}
                  {userMode === "admin" ? "Admin" : "Viewer"}
                </button>
            </div>

            <div className="flex bg-[#121212] p-1 rounded-2xl border border-gray-800 w-full md:w-auto">
              <button onClick={() => {setCurrentView("overview"); setIsMenuOpen(false);}} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${currentView === 'overview' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <LayoutDashboard size={16} /> Overview
              </button>
              <button onClick={() => {setCurrentView("list"); setIsMenuOpen(false);}} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${currentView === 'list' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <ListOrdered size={16} /> Order List
              </button>
            </div>
          </div>
        </header>

        {currentView === "overview" ? (
          <div className="space-y-6 md:space-y-8">
            {/* GRID 1: STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <MetricCard title="Total revenue" value={dynamicData.revenue} percentage="2.6" isWhite />
              <MetricCard title="Total orders" value={dynamicData.totalOrders} percentage="2.1" showCurrency={false} />
              <MetricCard title="Awaiting Orders" value={dynamicData.statusCounts.await} percentage="1.2"  showCurrency={false}/>
              <MetricCard title="Net profit" value={dynamicData.revenue * 0.6} percentage="5.6" />
            </div>

            {/* GRID 2: CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Revenue Graph */}
              <div className="lg:col-span-8 bg-[#121212] border border-gray-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 h-80 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-semibold flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" /> Revenue Trends</h3>
                      {hoveredTx && <span className="text-blue-400 text-[10px] font-mono whitespace-nowrap">{hoveredTx.customer}: ₹{hoveredTx.displayPrice}</span>}
                  </div>
                  <div className="relative h-40 w-full overflow-x-auto">
                    <div className="min-w-[600px] h-full relative">
                        <svg viewBox="0 0 800 150" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={dynamicData.points} strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex justify-between items-end gap-1">
                        {dynamicData.individualData.map((item) => (
                            <div key={item.id} onMouseEnter={() => setHoveredTx(item)} onMouseLeave={() => setHoveredTx(null)} className="flex-1 group relative flex flex-col justify-end h-full">
                            <div className={`w-full rounded-t-sm transition-all duration-300 ${hoveredTx?.id === item.id ? 'bg-blue-400' : 'bg-blue-600/10'}`} style={{ height: `${(item.displayPrice / dynamicData.maxPrice) * 100}%` }} />
                            </div>
                        ))}
                        </div>
                    </div>
                  </div>
              </div>

              {/* Pie Chart */}
              <div className="lg:col-span-4 bg-[#121212] border border-gray-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center">
                  <h3 className="text-sm font-semibold self-start mb-6">Sales by Category</h3>
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full relative" style={{ background: `conic-gradient(${dynamicData.pieData.map((d, i, arr) => {
                          const offset = arr.slice(0, i).reduce((s, item) => s + item.percent, 0);
                          return `${d.color} ${offset}% ${offset + d.percent}%`;
                      }).join(', ') || '#1f2937 0% 100%'})` }}>
                      <div className={`absolute inset-5 md:inset-6 rounded-full flex items-center justify-center border-4 ${darkMode ? 'bg-[#121212] border-[#080808]' : 'bg-white border-gray-50'}`}>
                          <span className="text-lg md:text-xl font-bold">{dynamicData.totalOrders}</span>
                      </div>
                  </div>
                  <div className="mt-6 w-full space-y-1">
                    {dynamicData.pieData.map((item, i) => (
                      <div key={i} className={`flex justify-between p-2 rounded-lg transition-colors ${hoveredSlice === item.name ? 'bg-white/5' : ''}`}>
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-[10px] text-gray-400">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-bold">{item.count}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
               <div className="bg-emerald-500 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white text-xs md:text-base font-bold">New: {dynamicData.statusCounts.new}</div>
               <div className="bg-orange-500 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white text-xs md:text-base font-bold">Await: {dynamicData.statusCounts.await}</div>
               <div className="bg-blue-600 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white text-xs md:text-base font-bold">On Way: {dynamicData.statusCounts.onway}</div>
               <div className="bg-slate-700 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white text-xs md:text-base font-bold">Done: {dynamicData.statusCounts.delivered}</div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-[#121212] border border-gray-800 rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" placeholder="Search..." className="bg-black border border-gray-700 rounded-xl py-2 pl-10 text-sm outline-none w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                {userMode === "admin" && (
                  <button onClick={() => { setEditUser(null); setToggle(true); }} className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2 text-sm">
                    <Plus size={18} /> Add Order
                  </button>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="text-[10px] text-gray-500 uppercase bg-[#0d0d0d]">
                    <tr>
                      <th className="px-4 md:px-6 py-4">Customer</th>
                      <th className="px-4 md:px-6 py-4">Category</th>
                      <th className="px-4 md:px-6 py-4">Price</th>
                      <th className="px-4 md:px-6 py-4">Status</th>
                      {userMode === "admin" && <th className="px-4 md:px-6 py-4">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="text-xs md:text-sm hover:bg-white/[0.02]">
                        <td className="px-4 md:px-6 py-4 font-medium">{t.customer}</td>
                        <td className="px-4 md:px-6 py-4 text-gray-400">{t.category}</td>
                        <td className="px-4 md:px-6 py-4 font-bold">₹{Number(t.price || t.amount).toLocaleString()}</td>
                        <td className="px-4 md:px-6 py-4">
                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase">{t.status}</span>
                        </td>
                        {userMode === "admin" && (
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex gap-3">
                              <button onClick={() => {setEditUser(t); setToggle(true)}} className="text-gray-500 hover:text-white">Edit</button>
                              <button onClick={() => DeleteFunction(t.id)} className="text-gray-500 hover:text-red-500">Delete</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL RESPONSIVENESS */}
        {toggle && userMode === "admin" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-white text-black rounded-3xl p-6 md:p-10 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setToggle(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-400 hover:text-black">✕</button>
              <TransactionForm closeForm={() => setToggle(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;