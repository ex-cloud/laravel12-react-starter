"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePage } from "@inertiajs/react"
import type { ReactNode } from "react"

export function PageTransition({ children }: { children: ReactNode }) {
  const { url, component } = usePage()
  const pathname = url.split("?")[0]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${component}-${pathname}`} // ✅ hindari render ulang saat query berubah
        initial={{ opacity: 0, filter: "blur(4px)", scale: 0.985 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        exit={{
          opacity: 0,
          filter: "blur(4px)",
          scale: 0.985,
          transition: { duration: 0.2 },
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
