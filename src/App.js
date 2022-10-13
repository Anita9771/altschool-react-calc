import { useReducer } from "react"
import NumbersButton from "./NumbersButton"
import OperationButton from "./OperationButton"
import "./App.css"

export const OPERATIONS = {
  ADDITION: "add",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE: "del",
  CALCULATE: "calculate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case OPERATIONS.ADDITION:
      if (state.overwrite) {
        return {
          ...state,
          inputDisplay: payload.number,
          overwrite: false,
        }
      }
      if (payload.number === "0" && state.inputDisplay === "0") {
        return state
      }
      if (payload.number === "." && state.inputDisplay.includes(".")) {
        return state
      }

      return {
        ...state,
        inputDisplay: `${state.inputDisplay || ""}${payload.number}`,
      }
    case OPERATIONS.CHOOSE_OPERATION:
      if (state.inputDisplay == null && state.outputDisplay == null) {
        return state
      }

      if (state.inputDisplay == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.outputDisplay == null) {
        return {
          ...state,
          operation: payload.operation,
          outputDisplay: state.inputDisplay,
          inputDisplay: null,
        }
      }

      return {
        ...state,
        outputDisplay: calculate(state),
        operation: payload.operation,
        inputDisplay: null,
      }
    case OPERATIONS.CLEAR:
      return {}
    case OPERATIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          inputDisplay: null,
        }
      }
      if (state.inputDisplay == null) return state
      if (state.inputDisplay.length === 1) {
        return { ...state, inputDisplay: null }
      }

      return {
        ...state,
        inputDisplay: state.inputDisplay.slice(0, -1),
      }
    case OPERATIONS.CALCULATE:
      if (
        state.operation == null ||
        state.inputDisplay == null ||
        state.outputDisplay == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        outputDisplay: null,
        operation: null,
        inputDisplay: calculate(state),
      }
      default:
        break;
  }
}

function calculate({ inputDisplay, outputDisplay, operation }) {
  const prev = parseFloat(outputDisplay)
  const current = parseFloat(inputDisplay)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "x":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
      break;
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ inputDisplay, outputDisplay, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator">
      <div className="display">
        <div className="output-display">
          {formatOperand(outputDisplay)} {operation}
        </div>
        <div className="input-display">{formatOperand(inputDisplay)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: OPERATIONS.CLEAR })}
      >
        CLEAR
      </button>
      <button onClick={() => dispatch({ type: OPERATIONS.DELETE })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <NumbersButton number="1" dispatch={dispatch} />
      <NumbersButton number="2" dispatch={dispatch} />
      <NumbersButton number="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <NumbersButton number="4" dispatch={dispatch} />
      <NumbersButton number="5" dispatch={dispatch} />
      <NumbersButton number="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <NumbersButton number="7" dispatch={dispatch} />
      <NumbersButton number="8" dispatch={dispatch} />
      <NumbersButton number="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <NumbersButton number="." dispatch={dispatch} />
      <NumbersButton number="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: OPERATIONS.CALCULATE })}
      >
        =
      </button>
    </div>
  )
}

export default App;
