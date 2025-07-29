import { motion } from "framer-motion"

interface TableSkeletonRowProps {
  columnCount: number
}

export function TableSkeletonRow({ columnCount }: TableSkeletonRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-pulse"
    >
      {Array.from({ length: columnCount }).map((_, idx) => (
        <td key={idx} className="px-4 py-3">
          <div className="h-4 w-full bg-muted rounded" />
        </td>
      ))}
    </motion.tr>
  )
}
