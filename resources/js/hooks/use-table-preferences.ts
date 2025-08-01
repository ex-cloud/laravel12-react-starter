import { useState, useEffect, useCallback } from "react"
import type { VisibilityState, Updater, SortingState, ColumnSizingState, ColumnFiltersState } from "@tanstack/react-table"

type Preferences = {
  pageSize: number
  columnVisibility: VisibilityState
  sorting: SortingState
  columnSizing?: ColumnSizingState
  columnFilters?: ColumnFiltersState
}

const DEFAULTS: Preferences = {
  pageSize: 10,
  columnVisibility: {},
  sorting: [], // ✅ default sorting kosong
}

export function useTablePreferences(tableKey: string) {
  const storageKey = `table:${tableKey}`

  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences((prev) => ({
          ...prev,
          ...parsed,
          columnSizing: parsed.columnSizing ?? {},
        }))
      } catch {
        console.warn(`Failed to parse table preferences for ${tableKey}`)
      }
    }
    setIsHydrated(true)
  }, [tableKey, storageKey])

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...updates }
      localStorage.setItem(storageKey, JSON.stringify(newPrefs))
      return newPrefs
    })
  }

  const setColumnVisibility = useCallback(
    (updater: Updater<VisibilityState>) => {
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
      })
    },
    [storageKey]
  )

  return {
    pageSize: preferences.pageSize,
    columnVisibility: preferences.columnVisibility,
    sorting: preferences.sorting,
    columnSizing: preferences.columnSizing ?? {},
    isHydrated,

    setPageSize: (size: number) => updatePreferences({ pageSize: size }),
    setColumnVisibility,

    setSorting: (updater: Updater<SortingState>) =>
      setPreferences((prev) => {
        const nextSorting =
          typeof updater === "function"
            ? updater(prev.sorting)
            : updater

        const nextPrefs = {
          ...prev,
          sorting: nextSorting,
        }

        localStorage.setItem(storageKey, JSON.stringify(nextPrefs))
        return nextPrefs
      }),

    setColumnSizing: (updater: Updater<ColumnSizingState>) =>
      setPreferences((prev) => {
        const nextSizing =
          typeof updater === "function"
            ? updater(prev.columnSizing ?? {})
            : updater

        console.log("💾 Saving columnSizing:", nextSizing)
        const nextPrefs = {
          ...prev,
          columnSizing: nextSizing,
        }

        localStorage.setItem(storageKey, JSON.stringify(nextPrefs))
        return nextPrefs
      }),

    setColumnFilters: (updater: Updater<ColumnFiltersState>) =>
      setPreferences((prev) => {
        const nextFilters =
          typeof updater === "function"
            ? updater(prev.columnFilters ?? [])
            : updater
        return { ...prev, columnFilters: nextFilters }
      }),

    // ✅ Tambahkan ini
    resetPreferences: (defaults?: Partial<Preferences>) => {
    localStorage.removeItem(storageKey)

    const finalDefaults = {
        ...DEFAULTS,
        ...defaults,
    }

    localStorage.setItem(storageKey, JSON.stringify(finalDefaults))
    setPreferences(finalDefaults)
    }
  }
}
