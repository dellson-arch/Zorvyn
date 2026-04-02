import { useContext, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import { DashBoardContext } from "../context/DashboardContext";
import { MoreVertical, Plus, Search } from "lucide-react";

const Dashboard = () => {
  const [toggle, setToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { Transactions, DeleteFunction, setEditUser } = useContext(DashBoardContext);

  // Filter transactions based on search
  const filteredTransactions = Transactions.filter(t =>
    t.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats based on status field
  const stats = {
    newOrders: Transactions.filter(t => t.status === "new").length,
    awaitingOrders: Transactions.filter(t => t.status === "await").length,
    onWayOrders: Transactions.filter(t => t.status === "on way").length,
    deliveredOrders: Transactions.filter(t => t.status === "delivered").length,
  };

  const StatCard = ({ title, count, trend, bgColor }) => (
    <div className={`rounded-2xl p-6 text-white ${bgColor}`}>
      <h3 className="text-sm font-medium opacity-90 mb-3">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold">{count}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-300/20 text-green-100" : "bg-red-300/20 text-red-100"}`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      </div>
      <p className="text-xs opacity-75">Than last week</p>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "delivered":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "on way":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "await":
        return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Order list</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="New orders" count={stats.newOrders} trend={2.8} bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600" />
        <StatCard title="Await accepting orders" count={stats.awaitingOrders} trend={-1.2} bgColor="bg-gradient-to-br from-orange-500 to-orange-600" />
        <StatCard title="On way orders" count={stats.onWayOrders} trend={-0.6} bgColor="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Delivered orders" count={stats.deliveredOrders} trend={2.8} bgColor="bg-gradient-to-br from-slate-600 to-slate-700" />
      </div>

      {/* Table Section */}
      <div className="bg-slate-900/50 rounded-lg overflow-hidden">
        
        {/* Table Controls */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2 pl-10 rounded focus:outline-none focus:border-slate-600"
              />
            </div>
            <span className="text-slate-400 text-sm">{filteredTransactions.length} orders</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-slate-300 hover:text-white text-sm px-3 py-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Export
            </button>
            <button
              onClick={() => {
                setEditUser(null);
                setToggle(true);
              }}
              className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Order Number</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Category</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Price</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Payment</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((elem) => (
                  <tr key={elem.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">{elem.orderNumber || "N/A"}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">{elem.customer}</p>
                        <p className="text-xs text-slate-500">{elem.phone || "No phone"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{elem.category}</td>
                    <td className="py-4 px-6 font-semibold text-white">₹{elem.price || elem.amount}</td>
                    <td className="py-4 px-6 text-slate-300">{elem.date}</td>
                    <td className="py-4 px-6 text-slate-300">{elem.payment}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(elem.status)}`}>
                        {elem.status?.charAt(0).toUpperCase() + elem.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditUser(elem);
                            setToggle(true);
                          }}
                          className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this order?")) {
                              DeleteFunction(elem.id);
                            }
                          }}
                          className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {toggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg shadow-xl relative">
            
            {/* Close button */}
            <button
              onClick={() => setToggle(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* Form */}
            <TransactionForm closeForm={() => setToggle(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;