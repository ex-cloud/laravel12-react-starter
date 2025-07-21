'use client'

import { motion } from 'framer-motion'
import { useRef, useLayoutEffect, useState } from 'react'

export function AnimatedBorderTrail({ children }: React.PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      setSize({ width: offsetWidth, height: offsetHeight })
    }
  }, [children])

  const strokeWidth = 1.5
  const borderRadius = 8

  const rectX = strokeWidth / 2
  const rectY = strokeWidth / 2
  const rectWidth = size.width - strokeWidth
  const rectHeight = size.height - strokeWidth
  const perimeter = 2 * (rectWidth + rectHeight)

  return (
    <div className="relative inline-block">
      {/* SVG BORDER WITH GLOW TRAIL */}
      <svg
        className="absolute top-0 left-0 z-0 pointer-events-none"
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
      >
        <defs>
          <filter id="glow">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#0ea5e9" floodOpacity="0.6" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#0ea5e9" floodOpacity="0.3" />
          </filter>
        </defs>

        <motion.rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={borderRadius}
          ry={borderRadius}
          fill="transparent"
          stroke="url(#stroke-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter}
          strokeLinecap="round"
          animate={{ strokeDashoffset: [perimeter, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          filter="url(#glow)"
        >
        </motion.rect>

        <defs>
          <linearGradient id="stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>

      {/* CONTENT WRAPPER */}
      <div
        ref={containerRef}
        className="relative z-10 inline-flex w-fit items-center px-2 py-[2px] rounded bg-transparent backdrop-blur-sm"
      >
        {children}
      </div>
    </div>
  )
}
