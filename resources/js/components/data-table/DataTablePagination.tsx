import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table as TableInstance } from "@tanstack/react-table"
import { getPageSizeOptions } from "@/utils/paginationHelpers"

type DataTablePaginationProps<TData> =
  | {
      table: TableInstance<TData>
    }
  | {
      table?: never // untuk server-side pagination
      pageIndex: number
      pageCount: number
      onPageChange: (index: number) => void
      pageSize: number
      onPageSizeChange: (size: number) => void
      selectedCount: number
      totalCount?: number
    }

export function DataTablePagination<TData>(props: DataTablePaginationProps<TData>) {
    const isClient = !!props.table

    const pageIndex = isClient ? props.table.getState().pagination.pageIndex : props.pageIndex
    const pageCount = isClient ? props.table.getPageCount() : props.pageCount
    const onPageChange = isClient ? props.table.setPageIndex : props.onPageChange!
    const pageSize = isClient ? props.table.getState().pagination.pageSize : props.pageSize!

    const selectedCount = isClient
        ? props.table.getFilteredSelectedRowModel().rows.length
        : props.selectedCount ?? 0

    const filteredCount = isClient
        ? props.table.getFilteredRowModel().rows.length
        : props.totalCount ?? 0

    const rawPageSizeOptions = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 25, label: "25" },
        { value: 30, label: "30" },
        { value: 40, label: "40" },
        { value: 50, label: "50" },
        { value: 100, label: "100 (Max)" },
    ]

    const pageSizeOptions = getPageSizeOptions(rawPageSizeOptions, filteredCount, pageSize)


    const onPageSizeChange = isClient
        ? (size: number) => {
            if (size <= 0) return
            props.table!.setPageSize(size)
        }
        : (size: number) => {
            if (size <= 0) return
            props.onPageSizeChange!(size)
        }

    const disableNav = pageCount === 0


    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
                {filteredCount === 0 ? (
                <span className="italic text-muted-foreground">No data available.</span>
                ) : (
                <>
                    <span className="block lg:hidden">{selectedCount} selected</span>
                    <span className="hidden lg:block">
                    {selectedCount} of {filteredCount} row(s) selected.
                    </span>
                </>
                )}
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                        Rows per page&nbsp;
                    </p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                        const size = Number(value)
                        onPageSizeChange(size)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[110px] sm:w-[130px] md:w-[140px]">
                        <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                        {pageSizeOptions.map(({ value, label, disabled }) => (
                            <SelectItem
                            key={value}
                            value={`${value}`}
                            disabled={disabled}

                            title={disabled ? "Jumlah data tidak mencukupi" : ""}
                            className={disabled ? "opacity-40 pointer-events-none cursor-not-allowed italic" : ""}
                            >
                            {label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>


                <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {pageIndex + 1} of {pageCount}
                </div>

                <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="hidden size-8 lg:flex"
                    onClick={() => onPageChange(0)}
                    disabled={pageIndex === 0 || disableNav}
                >
                    <ChevronsLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => onPageChange(pageIndex - 1)}
                    disabled={pageIndex === 0 || disableNav}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => onPageChange(pageIndex + 1)}
                    disabled={pageIndex + 1 >= pageCount || disableNav}
                >
                    <ChevronRight />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="hidden size-8 lg:flex"
                    onClick={() => onPageChange(pageCount - 1)}
                    disabled={pageIndex + 1 >= pageCount || disableNav}
                >
                    <ChevronsRight />
                </Button>
                </div>
            </div>
        </div>
    )
}
