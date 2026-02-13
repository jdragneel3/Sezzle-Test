export function Spinner() {
  return (
    <div
      className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-10"
      aria-label="Loading"
    >
      <div
        className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"
        role="status"
      />
    </div>
  )
}
