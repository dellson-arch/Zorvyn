import { createContext, useState, useEffect } from "react";

export const DashBoardContext = createContext();

export const ContextProvider = ({ children }) => {
  // GET: Initialize from localStorage
  const [Transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : []; 
  });

  const [editUser, setEditUser] = useState(null);

  // SET: Save to localStorage whenever Transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(Transactions));
  }, [Transactions]);

  const DeleteFunction = (id) => {
    setTransactions(Transactions.filter((t) => t.id !== id));
  };

  // Add/Update logic used by your TransactionForm
  const upsertTransaction = (data) => {
    if (data.id) {
      setTransactions(Transactions.map(t => t.id === data.id ? data : t));
    } else {
      setTransactions([...Transactions, { ...data, id: Date.now() }]);
    }
  };

  return (
    <DashBoardContext.Provider value={{ 
      Transactions, 
      setTransactions, 
      DeleteFunction, 
      editUser, 
      setEditUser,
      upsertTransaction 
    }}>
      {children}
    </DashBoardContext.Provider>
  );
};