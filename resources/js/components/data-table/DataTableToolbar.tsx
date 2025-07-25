"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Loader2, RotateCcw, Search, Settings2, Trash } from "lucide-react"
import { useTable } from "./TableContext"

interface DataTableToolbarProps<TData> {
  searchValue?: string
  onSearchChange?: (value: string) => void
  isLoading?: boolean
  selectedRows?: TData[]
  onResetSelection?: () => void
  onBulkDelete?: () => void
  onAddClick?: () => void
  addButtonLabel?: string
  showSearch?: boolean
  showAddButton?: boolean
}

export function DataTableToolbar<TData extends { id: number | string }>({
  searchValue = "",
  onSearchChange,
  isLoading = false,
  selectedRows = [],
  onResetSelection,
  onBulkDelete,
  onAddClick,
  addButtonLabel = "Add",
  showSearch = true,
  showAddButton = true,
}: DataTableToolbarProps<TData>) {
  const table = useTable<TData>()

  return (
    <div className="flex flex-wrap justify-between items-start py-4 gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        {showSearch && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 pr-8"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        )}

        {selectedRows.length > 0 && (
          <>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer flex items-center"
                >
                <Trash className="mr-2 h-4 w-4" />
                Bulk Actions
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem
                onClick={onBulkDelete}
                className="text-red-600 focus:text-red-700"
                >
                <Trash className="mr-2 h-4 w-4" />
                Delete selected ({selectedRows.length})
                </DropdownMenuItem>
        
                <DropdownMenuItem onClick={onResetSelection}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Selection
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

          </>
        )}
      </div>

      <div className="flex gap-2 items-center">
        {/* Toggle Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer flex items-center"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => column.id !== "select" && column.getCanHide())
              .map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={(e) => e.preventDefault()} // prevent closing
                  className="capitalize"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={(e) => column.toggleVisibility(e.target.checked)}
                    className="mr-2"
                  />
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id.replace(/_/g, " ")}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showAddButton && (
          <Button type="button" variant="default" onClick={onAddClick}>
            + {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
