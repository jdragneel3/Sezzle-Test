import { formatNumber } from '../../utils/formatNumber'

interface DisplayProps {
  main: string
  secondary?: string
}

export function Display({ main, secondary }: DisplayProps) {
  const formatted = formatNumber(main)
  return (
    <div
      className="bg-gray-800 text-white rounded-t-2xl p-4 min-h-[120px] flex flex-col justify-end text-right"
      aria-live="polite"
      aria-label={`Display: ${formatted}`}
    >
      {secondary && (
        <div className="text-xl text-gray-400 mb-1 truncate" aria-hidden>
          {secondary}
        </div>
      )}
      <div className="text-4xl sm:text-5xl font-light truncate tabular-nums">
        {formatted}
      </div>
    </div>
  )
}
