import React from 'react'

export interface GoogleIconProps {
  name: string
  className?: string
  style?: React.CSSProperties
  size?: number | string
  filled?: boolean
}

export default function GoogleIcon({
  name,
  className = '',
  style,
  size,
  filled = false
}: GoogleIconProps) {
  return (
    <span
      className={`material-symbols-outlined notranslate ${className}`}
      translate="no"
      lang="en"
      data-no-translation="true"
      style={{
        fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : undefined,
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        verticalAlign: 'middle',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
