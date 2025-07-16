// utils/highlight.tsx
import React from "react"

export function highlightSearch(text: string, keyword: string): React.ReactNode {
  if (!keyword) return text

  const regex = new RegExp(`(${keyword})`, "gi")
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part: string, i: number) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} className="bg-sky-300 text-black px-1 rounded">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}
