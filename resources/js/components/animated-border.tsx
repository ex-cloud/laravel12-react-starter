'use client'

import { motion } from 'framer-motion'
import { useRef, useLayoutEffect, useState } from 'react'

export default function AnimatedSVGBorder({ children }: React.PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      setSize({ width: offsetWidth, height: offsetHeight })
    }
  }, [children])

  const strokeWidth = 1
  const borderRadius = 4

  const rectX = strokeWidth / 2
  const rectY = strokeWidth / 2
  const rectWidth = size.width - strokeWidth
  const rectHeight = size.height - strokeWidth
  const perimeter = 2 * (rectWidth + rectHeight)

  return (
    // ROTATE THIS ENTIRE BLOCK
    <div className="relative inline-block -rotate-2">
      {/* SVG BORDER */}
      <svg
        className="absolute top-0 left-0 z-0 pointer-events-none"
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        style={{ paddingInline: 4, paddingBlock: 2 }}
      >
        <motion.rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={borderRadius}
          ry={borderRadius}
          fill="transparent"
          stroke="oklch(68.5% 0.169 237.323)"
          strokeWidth={strokeWidth}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter}
          strokeLinecap="round"
          animate={{ strokeDashoffset: [perimeter, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>

      {/* CONTENT WRAPPER */}
      <div
        ref={containerRef}
        className="relative z-10 inline-flex items-center px-2 py-[2px] bg-transparent backdrop-blur-sm border border-gray-500/50 rounded leading-none"
      >
        {children}
      </div>
    </div>
  )
}
