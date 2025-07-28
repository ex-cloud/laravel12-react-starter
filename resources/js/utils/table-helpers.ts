import type { Column } from "@tanstack/react-table"

export function getColumnWidthClass<TData, TValue>(
  column: Column<TData, TValue>
): string {
  return column.columnDef.meta?.width ?? "min-w-[120px]"
}
