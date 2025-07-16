import { createContext, useContext } from "react"
import type { Table } from "@tanstack/react-table"

// Buat context generic TANPA default value
export const TableContext = createContext<unknown>(null)

export const useTable = <TData,>() => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error("useTable must be used within a TableContext.Provider")
  }
  return context as Table<TData>
}
