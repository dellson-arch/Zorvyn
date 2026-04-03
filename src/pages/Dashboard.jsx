import { useContext, useState, useMemo, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import { DashBoardContext } from "../context/DashboardContext";
import { Plus, Search, LayoutDashboard, ListOrdered, TrendingUp, ShieldCheck, Eye, Sun, Moon } from "lucide-react";

// Helper for the top cards
const MetricCard = ({ title, value, percentage, isWhite = false }) => {
  const bgColor = isWhite ? 'bg-white' : 'bg-[#121212] border border-gray-800';
  const textColor = isWhite ? 'text-gray-900' : 'text-white';
  const labelColor = isWhite ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`p-6 rounded-3xl ${bgColor} flex flex-col justify-between h-40 transition-all shadow-lg card-theme`}>
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${labelColor}`}>{title}</span>
        <div className={`p-2 rounded-full border ${isWhite ? 'border-gray-200' : 'border-gray-700'}`}>
          <Plus size={14} className="rotate-45" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h2 className={`text-3xl font-bold ${textColor}`}>
             {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
          </h2>
          <span className="bg-green-900/30 text-green-400 text-[10px] px-2 py-1 rounded-full">↑ {percentage}%</span>
        </div>
        <p className={`text-[10px] mt-1 ${labelColor}`}>This month vs last</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [toggle, setToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- LOCAL STORAGE INITIATION ---
  
  // Initialize state from localStorage or use defaults
 const [userMode, setUserMode] = useState(() => {
    try {
      return localStorage.getItem("userMode") || "admin";
    } catch {
      return "admin";
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("darkMode");
      // Explicitly check for null because JSON.parse(null) is null, but we want true
      return savedTheme !== null ? JSON.parse(savedTheme) : true;
    } catch {
      return true;
    }
  });

  // Effect to save settings whenever they change
  useEffect(() => {
    localStorage.setItem("userMode", userMode);
  }, [userMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // --------------------------------

  const [hoveredTx, setHoveredTx] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

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
      name,
      count,
      percent: (count / totalOrders) * 100,
      color: colors[i % colors.length]
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
          .bg-\\[\\#0d0d0d\\] { background-color: #f3f4f6 !important; }
        `}</style>
      )}

      <div className="p-8 font-sans">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Hello, Nayan! 👋</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">
              Status: <span className={userMode === "admin" ? "text-red-500" : "text-blue-500"}>{userMode}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-[#121212] border-gray-800 text-yellow-400' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setUserMode(userMode === "admin" ? "viewer" : "admin")}
              className="flex items-center gap-2 bg-[#121212] border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-all"
            >
              {userMode === "admin" ? <ShieldCheck size={16} className="text-red-400" /> : <Eye size={16} className="text-blue-400" />}
              {userMode === "admin" ? "Admin" : "Viewer"}
            </button>

            <div className="flex bg-[#121212] p-1 rounded-2xl border border-gray-800">
              <button onClick={() => setCurrentView("overview")} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${currentView === 'overview' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <LayoutDashboard size={16} /> Overview
              </button>
              <button onClick={() => setCurrentView("list")} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${currentView === 'list' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <ListOrdered size={16} /> Order List
              </button>
            </div>
          </div>
        </header>

        {currentView === "overview" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard title="Total revenue" value={dynamicData.revenue} percentage="2.6" isWhite />
              <MetricCard title="Total orders" value={dynamicData.totalOrders} percentage="2.1" />
              <MetricCard title="Awaiting Orders" value={dynamicData.statusCounts.await} percentage="1.2" />
              <MetricCard title="Net profit" value={dynamicData.revenue * 0.6} percentage="5.6" />
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 bg-[#121212] border border-gray-800 rounded-[2.5rem] p-8 h-80 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-semibold flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" /> Revenue Trends</h3>
                      {hoveredTx && (
                        <span className="text-blue-400 text-xs font-mono">{hoveredTx.customer}: ₹{hoveredTx.displayPrice}</span>
                      )}
                  </div>
                  <div className="relative h-44 w-full">
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

              <div className="col-span-4 bg-[#121212] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center">
                  <h3 className="text-sm font-semibold self-start mb-6">Sales by Category</h3>
                  <div className="w-40 h-40 rounded-full relative" style={{ background: `conic-gradient(${dynamicData.pieData.map((d, i, arr) => {
                          const offset = arr.slice(0, i).reduce((s, item) => s + item.percent, 0);
                          return `${d.color} ${offset}% ${offset + d.percent}%`;
                      }).join(', ') || '#1f2937 0% 100%'})` }}>
                      <div className={`absolute inset-6 rounded-full flex items-center justify-center border-4 ${darkMode ? 'bg-[#121212] border-[#080808]' : 'bg-white border-gray-50'}`}>
                          <span className="text-xl font-bold">{dynamicData.totalOrders}</span>
                      </div>
                  </div>
                  <div className="mt-6 w-full space-y-1">
                    {dynamicData.pieData.map((item, i) => (
                      <div key={i} onMouseEnter={() => setHoveredSlice(item.name)} onMouseLeave={() => setHoveredSlice(null)} className={`flex justify-between p-2 rounded-lg transition-colors ${hoveredSlice === item.name ? 'bg-white/5' : ''}`}>
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
            <div className="grid grid-cols-4 gap-4">
               <div className="bg-emerald-500 p-6 rounded-3xl text-white">New: {dynamicData.statusCounts.new}</div>
               <div className="bg-orange-500 p-6 rounded-3xl text-white">Await: {dynamicData.statusCounts.await}</div>
               <div className="bg-blue-600 p-6 rounded-3xl text-white">On Way: {dynamicData.statusCounts.onway}</div>
               <div className="bg-slate-700 p-6 rounded-3xl text-white">Done: {dynamicData.statusCounts.delivered}</div>
            </div>

            <div className="bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" placeholder="Search..." className="bg-black border border-gray-700 rounded-xl py-2 pl-10 text-sm outline-none w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                {userMode === "admin" && (
                  <button onClick={() => { setEditUser(null); setToggle(true); }} className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 flex items-center gap-2">
                    <Plus size={18} /> Add Order
                  </button>
                )}
              </div>
              <table className="w-full text-left">
                <thead className="text-[10px] text-gray-500 uppercase bg-[#0d0d0d]">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    {userMode === "admin" && <th className="px-6 py-4">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="text-sm hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium">{t.customer}</td>
                      <td className="px-6 py-4 text-gray-400">{t.category}</td>
                      <td className="px-6 py-4 font-bold">₹{Number(t.price || t.amount).toLocaleString()}</td>
                      <td className="px-6 py-4">
                          <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{t.status}</span>
                      </td>
                      {userMode === "admin" && (
                        <td className="px-6 py-4 flex gap-4">
                          <button onClick={() => {setEditUser(t); setToggle(true)}} className="text-gray-500 hover:text-white">Edit</button>
                          <button onClick={() => DeleteFunction(t.id)} className="text-gray-500 hover:text-red-500">Delete</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {toggle && userMode === "admin" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-white text-black rounded-3xl p-10 w-full max-w-lg relative">
              <button onClick={() => setToggle(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black">✕</button>
              <TransactionForm closeForm={() => setToggle(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;