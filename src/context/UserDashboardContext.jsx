import React, { createContext, useState } from 'react';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [data] = useState({
    user: "Barbara",
    stats: {
      totalRevenue: 99560,
      totalOrders: 35,
      totalVisitors: 45600,
      netProfit: 60450,
      pendingOrders: 98,
      awaitingCustomers: 17
    },
    categories: [
      { name: "Apple MacBook Air M2", color: "#3b82f6" },
      { name: "Apple Watch Series 9", color: "#22c55e" },
      { name: "Acoustics JBL Charge 5", color: "#f59e0b" },
      { name: "Acoustics Divaom Song...", color: "#a855f7" },
      { name: "Apple AirPods Pro 2", color: "#ec4899" }
    ]
  });

  

  return (
    <DashboardContext.Provider value={{data}}>
      {children}
    </DashboardContext.Provider>
  );
};

