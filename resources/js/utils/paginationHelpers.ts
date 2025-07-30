export type PageSizeOption = {
  value: number
  label: string
  disabled?: boolean
}

/**
 * Generate page size options with disabled flag and label indicating current page size.
 *
 * @param rawOptions - Default page size options
 * @param filteredCount - Total filtered rows count
 * @param currentPageSize - Current page size selected
 */
export function getPageSizeOptions(
  rawOptions: PageSizeOption[],
  filteredCount: number,
  currentPageSize: number
): PageSizeOption[] {
  // Ambil semua opsi yang lebih besar atau sama dengan jumlah data
  const availableOptions = rawOptions.filter(({ value }) => value >= filteredCount)

  // Tambahkan opsi saat ini jika belum ada
  if (!availableOptions.some(({ value }) => value === currentPageSize)) {
    availableOptions.unshift({ value: currentPageSize, label: `${currentPageSize}` })
  }

  // Ambil semua opsi yang nilainya <= jumlah data
  const enabledOptions = rawOptions.filter(({ value }) => value <= filteredCount)

  // Cari opsi pertama setelah jumlah data (jika ada)
  const firstLargerOption = rawOptions.find(({ value }) => value > filteredCount)

  // Gabungkan: opsi <= data + 1 opsi > data (jika ada)
  const activeOptions = firstLargerOption
    ? [...enabledOptions, firstLargerOption]
    : [...enabledOptions]

  const activeValuesSet = new Set(activeOptions.map((opt) => opt.value))

  // Siapkan opsi final dengan flag disabled (kecuali pageSize sekarang)
  return rawOptions.map(({ value, label }) => ({
    value,
    label,
    // label: value === currentPageSize ? `${label} (current)` : label,
    disabled: !activeValuesSet.has(value) && value !== currentPageSize,
  }))
}
