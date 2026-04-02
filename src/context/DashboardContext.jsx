import { createContext, useState} from "react";

export const DashBoardContext = createContext()

export let ContextProvider = ({children})=>{
     const[Transactions , setTransactions] = useState([])
     const[editUser , setEditUser] = useState(null)

     const DeleteFunction = (id)=>{
        setTransactions(prev => prev.filter((t)=> t.id != id))
     }
     
  
    return(
        <DashBoardContext.Provider value={{Transactions , setTransactions , DeleteFunction , editUser , setEditUser}}>
            {children}
        </DashBoardContext.Provider>
    )
}
