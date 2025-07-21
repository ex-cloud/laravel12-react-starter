'use client'

import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import { BorderTrail } from './border-trail'

type BorderTrailWrapperProps = {
  children: ReactNode
  className?: string
  size?: number
  style?: CSSProperties
}

export function BorderTrailWrapper({
  children,
  className,
  size = 60,
  style,
}: BorderTrailWrapperProps) {
  return (
    <div
      className={clsx(
        'relative inline-block w-fit items-center justify-center rounded-md bg-transparent dark:bg-zinc-800/20 backdrop-blur-md px-3 py-2 ring ring-inset ring-border mt-2',
        className
      )}
    >
      <BorderTrail style={style} size={size} />
      <div className="relative z-10 w-fit">{children}</div>
    </div>
  )
}
