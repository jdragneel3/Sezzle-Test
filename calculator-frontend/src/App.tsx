import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'
import { Calculator } from './components/Calculator/Calculator'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Calculator />
      </div>
    </ErrorBoundary>
  )
}

export default App
