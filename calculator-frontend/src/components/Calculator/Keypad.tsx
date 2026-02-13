import type { Operation } from '../../types/calculator.types'
import { Button } from './Button'

interface KeypadProps {
  onDigit: (digit: string) => void
  onDecimal: () => void
  onClear: () => void
  onToggleSign: () => void
  onPercentage: () => void
  onOperation: (op: Operation) => void
  onEquals: () => void
  onSqrt?: () => void
  showExtraRow?: boolean
  onToggleExtraRow?: () => void
}

export function Keypad({
  onDigit,
  onDecimal,
  onClear,
  onToggleSign,
  onPercentage,
  onOperation,
  onEquals,
  onSqrt,
  showExtraRow = false,
  onToggleExtraRow,
}: KeypadProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-b-2xl grid grid-cols-4 gap-3">
      {/* Fila extra desplegable hacia arriba: √, xʸ (aparece sobre la primera fila) */}
      {showExtraRow && onSqrt && (
        <>
          <Button label="√" type="function" onClick={onSqrt} />
          <Button label="xʸ" type="function" onClick={() => onOperation('power')} />
          <span />
          <span />
        </>
      )}

      {/* Fila 1: AC, botón ⋯ (2ª columna), %, ÷ */}
      <Button label="AC" type="clear" onClick={onClear} />
      {onToggleExtraRow ? (
        <Button
          label={showExtraRow ? '▲' : '⋯'}
          type="function"
          onClick={onToggleExtraRow}
        />
      ) : (
        <div aria-hidden />
      )}
      <Button label="%" type="function" onClick={onPercentage} />
      <Button label="÷" type="operator" onClick={() => onOperation('divide')} />

      {/* Filas 2-4: números y operadores en columna derecha */}
      <Button label="7" type="number" onClick={() => onDigit('7')} />
      <Button label="8" type="number" onClick={() => onDigit('8')} />
      <Button label="9" type="number" onClick={() => onDigit('9')} />
      <Button label="×" type="operator" onClick={() => onOperation('multiply')} />

      <Button label="4" type="number" onClick={() => onDigit('4')} />
      <Button label="5" type="number" onClick={() => onDigit('5')} />
      <Button label="6" type="number" onClick={() => onDigit('6')} />
      <Button label="−" type="operator" onClick={() => onOperation('subtract')} />

      <Button label="1" type="number" onClick={() => onDigit('1')} />
      <Button label="2" type="number" onClick={() => onDigit('2')} />
      <Button label="3" type="number" onClick={() => onDigit('3')} />
      <Button label="+" type="operator" onClick={() => onOperation('add')} />

      {/* Última fila: cambiar signo, cero, punto, igual */}
      <Button label="+/-" type="function" onClick={onToggleSign} />
      <Button label="0" type="number" onClick={() => onDigit('0')} />
      <Button label="." type="number" onClick={onDecimal} />
      <Button label="=" type="equals" onClick={onEquals} />
    </div>
  )
}
