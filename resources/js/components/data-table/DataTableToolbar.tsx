"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Check, Loader2, RotateCcw, Search, Settings2, Trash, FileDown, Plus, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useTable } from "./TableContext"
import { useTablePreferences } from "@/hooks/use-table-preferences"
import { useDebounce } from "@/hooks/use-debounce"

interface BulkDeletePayload {
    selectAll: boolean
    selectedIds: string[]
    activeSearch?: string
    filters?: {
        search?: string
        status?: string
        role?: string
    }
}

interface DataTableToolbarProps<TData> {
  searchValue?: string
  onSearchChange?: (value: string) => void
  isLoading?: boolean
  selectedRows?: TData[]
  onResetSelection?: () => void
  onBulkDelete?: (payload: BulkDeletePayload) => void
  onExportCSV?: () => void
  onAddClick?: () => void
  addButtonLabel?: string
  showSearch?: boolean
  showAddButton?: boolean
  canAdd?: boolean
  tableId: string
  totalCount: number
  selectAllAcrossPages?: boolean
  setSelectAllAcrossPages?: (value: boolean) => void
  onSelectAllIds?: (allIds: string[]) => void;
}

export function DataTableToolbar<TData extends { id: number | string }>({
    searchValue = "",
    onSearchChange,
    isLoading = false,
    selectedRows = [],
    onBulkDelete,
    onExportCSV,
    onAddClick,
    addButtonLabel = "Add",
    showSearch = true,
    showAddButton = true,
    canAdd = true,
    tableId,
    totalCount,
    selectAllAcrossPages,
    setSelectAllAcrossPages,
    onSelectAllIds,
}: DataTableToolbarProps<TData>) {
  const table = useTable<TData>()
  const { resetPreferences } = useTablePreferences(tableId)

  const [inputValue, setInputValue] = useState(searchValue)
  const debouncedSearch = useDebounce(inputValue, 300)

  useEffect(() => {
      onSearchChange?.(debouncedSearch)
    }, [debouncedSearch, onSearchChange])


  const hideableColumns = useMemo(() =>
    table.getAllColumns().filter((col) =>
      col.getCanHide() && col.id !== "select" && col.id !== "actions"
    ), [table])

    const allColumnsVisible = hideableColumns.every((col) => col.getIsVisible())
    const allSelected = selectAllAcrossPages ?? false
    const updateSelectAllAcrossPages = setSelectAllAcrossPages ?? (() => {})

    const rowSelection = table.getState().rowSelection

    useEffect(() => {
        if (selectAllAcrossPages && Object.keys(rowSelection).length !== totalCount) {
            setSelectAllAcrossPages?.(false)
        }
    }, [rowSelection, selectAllAcrossPages, totalCount, setSelectAllAcrossPages])


    const columnsHidden = useMemo(() => {
        return hideableColumns.every((col) => !col.getIsVisible())
    }, [hideableColumns])

  return (
  <>
    {/* Top bar: Bulk info + Search + Action buttons */}
    <div className="lg:hidden flex justify-end items-end gap-2">
        {showSearch && (
            <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pl-10 pr-8"
                />
                {inputValue && !isLoading && (
                    <button
                        onClick={() => setInputValue("")}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                {isLoading && (
                    <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>
        )}
    </div>
    <div className="flex flex-wrap justify-between items-center gap-2 bg-white dark:bg-transparent border border-border p-2 rounded-md">
        {/* Kiri: Info bulk selection (jika ada) */}
        <div className="flex items-center gap-2">
            {Object.keys(table.getState().rowSelection).length > 0 && (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                            <Trash className="h-4 w-4"/>
                                Bulk Actions
                            </Button>
                        </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (selectedRows.length === 0 && !allSelected) return; // Tambahan keamanan
                                        onBulkDelete?.({
                                        selectAll: allSelected,
                                        selectedIds: allSelected ? [] : Object.keys(table.getState().rowSelection),
                                        activeSearch: debouncedSearch,
                                        });
                                    }}
                                    disabled={!allSelected && selectedRows.length === 0}
                                    className="text-red-600 focus:text-red-700 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                                    >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete selected ({allSelected ? totalCount : selectedRows.length})
                                </DropdownMenuItem>

                                {onExportCSV && (
                                <DropdownMenuItem onClick={onExportCSV}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export to CSV
                                </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                </>
            )}
        </div>
            {/* Kanan: Search, View, Add */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    {showSearch && (
                        <div className="relative w-64 hidden lg:inline">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="pl-10 pr-8"
                            />
                            {inputValue && !isLoading && (
                                <button
                                    onClick={() => setInputValue("")}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Settings2 className="h-4 w-4" />
                            View
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[200px] px-2 py-2">
                        <p className="text-xs text-muted-foreground px-2 pb-2">Tampilkan Kolom</p>
                        {hideableColumns.map((column) => {
                            const label =
                            typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id.replace(/_/g, " ")
                            return (
                            <Tooltip key={column.id}>
                                <TooltipTrigger asChild>
                                <DropdownMenuCheckboxItem
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    className="capitalize data-[state=checked]:font-medium text-[13px] px-2 py-1.5 rounded-md flex items-center gap-x-2"
                                >
                                    {column.getIsVisible() ? <Check className="w-3 h-3" /> : <div className="w-4 h-4" />}
                                    {label}
                                </DropdownMenuCheckboxItem>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                Tampilkan/sembunyikan kolom "{label}"
                                </TooltipContent>
                            </Tooltip>
                            )
                        })}
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem
                            onClick={() => {
                                const shouldHide = !columnsHidden
                                hideableColumns.forEach((c) => c.toggleVisibility(!shouldHide))
                            }}
                            className="text-[13px]"
                            >
                            {columnsHidden ? "Show All Columns" : "Hide All Columns"}
                        </DropdownMenuItem>


                        {!allColumnsVisible && (
                            <>
                            <DropdownMenuSeparator className="my-2" />
                            <DropdownMenuItem
                                onClick={() => {
                                resetPreferences()
                                location.reload()
                                }}
                                className="text-red-600 text-[13px]"
                            >
                                <RotateCcw className="mr-2 h-3 w-3" />
                                Reset Preferences
                            </DropdownMenuItem>
                            </>
                        )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {showAddButton && canAdd && (
                        <Button type="button" variant="outline" size="sm" onClick={onAddClick} className="text-xs">
                            <Plus className="h-4 w-4"/>
                            <span className="hidden lg:inline">{addButtonLabel}</span>
                        </Button>
                    )}
                </div>
            </div>
    </div>

    {(Object.keys(table.getState().rowSelection).length > 0 || allSelected) && (
        <div className="flex justify-between items-center bg-muted/50 dark:bg-transparent border border-border p-2 rounded-md">
            <span className="text-xs text-muted-foreground">
            {allSelected
                ? `All ${totalCount} records selected across all pages`
                : `${Object.keys(table.getState().rowSelection).length} records selected`}
            </span>

            <div className="flex items-center gap-2 text-xs">
            {!allSelected && (
                <button
                className="underline text-primary"
                onClick={() => {
                    updateSelectAllAcrossPages(true);

                    // Ambil semua ID dari data table (pastikan table.options.data berisi data yang lengkap!)
                    const allIds = table.options.data.map((row) => row.id.toString());

                    // Trigger callback dari parent
                    if (typeof onSelectAllIds === "function") {
                      onSelectAllIds(allIds);
                    }
                  }}
                >
                Select all {totalCount} rows
                </button>
            )}
            <div
                onClick={() => {
                table.resetRowSelection()
                updateSelectAllAcrossPages(false)
                }}
                className="cursor-pointer flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
                <RotateCcw className="h-3 w-3" />
                Deselect all
            </div>
            </div>
        </div>
    )}


    {/* Active filters badge */}
    {inputValue && (
        <div className="flex justify-between items-center bg-muted/50 dark:bg-transparent border border-border p-2 rounded-md">
            <div className="text-xs flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Active filters:</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">
                    Search: {inputValue}
                </span>
                <button
                    type="button"
                    onClick={() => setInputValue("")}
                    className="text-muted-foreground hover:text-foreground hover:underline "
                >
                    <X className="h-3 w-3" />

                </button>
            </div>
        </div>
    )}
  </>
)

}
