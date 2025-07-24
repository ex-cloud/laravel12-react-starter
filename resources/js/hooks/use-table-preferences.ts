import { useState, useEffect } from "react"
import type { VisibilityState, Updater } from "@tanstack/react-table"

type Preferences = {
  pageSize: number
  columnVisibility: VisibilityState
}

const DEFAULTS: Preferences = {
  pageSize: 10,
  columnVisibility: {},
}

export function useTablePreferences(tableKey: string) {
  const storageKey = `table:${tableKey}`

  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences((prev) => ({
          ...prev,
          ...parsed,
        }))
      } catch {
        console.warn(`Failed to parse table preferences for ${tableKey}`)
      }
    }
  }, [tableKey, storageKey])

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...updates }
      localStorage.setItem(storageKey, JSON.stringify(newPrefs))
      return newPrefs
    })
  }

  return {
    pageSize: preferences.pageSize,
    columnVisibility: preferences.columnVisibility,
    setPageSize: (size: number) => updatePreferences({ pageSize: size }),

    // ✅ fix here
    setColumnVisibility: (updater: Updater<VisibilityState>) =>
      setPreferences((prev) => {
        const nextVisibility =
          typeof updater === "function"
            ? updater(prev.columnVisibility)
            : updater

        const nextPrefs = {
          ...prev,
          columnVisibility: nextVisibility,
        }

        localStorage.setItem(storageKey, JSON.stringify(nextPrefs))
        return nextPrefs
      }),
  }
}
