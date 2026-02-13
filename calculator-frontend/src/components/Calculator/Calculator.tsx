import { useEffect, useCallback, useRef, useState } from 'react'
import { useCalculator } from '../../hooks/useCalculator'
import type { Operation } from '../../types/calculator.types'
import { Display } from './Display'
import { Keypad } from './Keypad'
import { Spinner } from '../Loading/Spinner'

const ERROR_AUTO_DISMISS_MS = 3000

export function Calculator() {
  const { state, dispatch, handleCalculate, handleSqrt } = useCalculator()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showExtraRow, setShowExtraRow] = useState(false)

  useEffect(() => {
    if (!state.error) return
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_ERROR' })
    }, ERROR_AUTO_DISMISS_MS)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [state.error, dispatch])

  const handleDigit = useCallback((digit: string) => {
    dispatch({ type: 'INPUT_DIGIT', payload: digit })
  }, [dispatch])

  const handleOperator = useCallback((op: Operation) => {
    if (state.operation && state.previousValue !== null && !state.waitingForOperand) {
      handleCalculate().then(() => {
        dispatch({ type: 'SET_OPERATION', payload: op })
      })
    } else {
      dispatch({ type: 'SET_OPERATION', payload: op })
    }
  }, [state.operation, state.previousValue, state.waitingForOperand, dispatch, handleCalculate])

  const handleEquals = useCallback(() => {
    if (state.operation) {
      void handleCalculate()
    }
  }, [state.operation, handleCalculate])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault()
        handleDigit(e.key)
        return
      }
      switch (e.key) {
        case '.':
          e.preventDefault()
          dispatch({ type: 'INPUT_DECIMAL' })
          break
        case '+':
          e.preventDefault()
          handleOperator('add')
          break
        case '-':
          e.preventDefault()
          handleOperator('subtract')
          break
        case '*':
          e.preventDefault()
          handleOperator('multiply')
          break
        case '/':
          e.preventDefault()
          handleOperator('divide')
          break
        case 'Enter':
          e.preventDefault()
          handleEquals()
          break
        case 'Escape':
          e.preventDefault()
          dispatch({ type: 'CLEAR' })
          break
        default:
          break
      }
    },
    [handleDigit, handleOperator, handleEquals, dispatch]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const secondary =
    state.operation && state.previousValue !== null
      ? `${state.previousValue} ${state.operation === 'add' ? '+' : state.operation === 'subtract' ? '−' : state.operation === 'multiply' ? '×' : state.operation === 'divide' ? '÷' : state.operation === 'power' ? 'xʸ' : state.operation === 'percentage' ? '%' : ''}`
      : undefined

  return (
    <div
      className={`relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl ${state.error ? 'animate-shake' : ''}`}
      role="application"
      aria-label="Calculator"
    >
      <Display main={state.display} secondary={secondary} />
      {/* Fila debajo del display: botón borrar a la derecha, sin tapar los números */}
      <div className="flex justify-end bg-gray-800 px-3 pb-2 -mt-1">
        <button
          type="button"
          onClick={() => dispatch({ type: 'BACKSPACE' })}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Borrar último dígito"
        >
          ⌫
        </button>
      </div>
      {state.error && (
        <div
          className="bg-red-900/90 text-red-100 text-sm text-center py-2 px-3"
          role="alert"
        >
          {state.error}
        </div>
      )}
      {state.isLoading && <Spinner />}
      <Keypad
        onDigit={handleDigit}
        onDecimal={() => dispatch({ type: 'INPUT_DECIMAL' })}
        onClear={() => dispatch({ type: 'CLEAR' })}
        onToggleSign={() => dispatch({ type: 'TOGGLE_SIGN' })}
        onPercentage={() => dispatch({ type: 'PERCENTAGE' })}
        onOperation={handleOperator}
        onEquals={handleEquals}
        onSqrt={handleSqrt}
        showExtraRow={showExtraRow}
        onToggleExtraRow={() => setShowExtraRow((s) => !s)}
      />
    </div>
  )
}
