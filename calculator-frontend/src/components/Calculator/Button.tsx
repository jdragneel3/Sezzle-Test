import type { ButtonType } from '../../types/calculator.types'

interface ButtonProps {
  label: string
  onClick: () => void
  type: ButtonType
  gridColumn?: string
  className?: string
}

const typeClasses: Record<ButtonType, string> = {
  number: 'bg-gray-700 hover:bg-gray-600 text-white',
  operator: 'bg-orange-500 hover:bg-orange-600 text-white',
  function: 'bg-gray-500 hover:bg-gray-400 text-white',
  clear: 'bg-gray-500 hover:bg-gray-400 text-white',
  equals: 'bg-orange-500 hover:bg-orange-600 text-white',
}

export function Button({
  label,
  onClick,
  type,
  gridColumn,
  className = '',
}: ButtonProps) {
  const base =
    'h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-lg active:scale-95 transition-transform duration-75 flex items-center justify-center text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500'
  const typeClass = typeClasses[type]
  const style = gridColumn ? { gridColumn } : undefined
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${typeClass} ${className}`}
      style={style}
      aria-label={label}
    >
      {label}
    </button>
  )
}
