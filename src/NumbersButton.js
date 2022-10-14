import React from 'react'
import { OPERATIONS } from "./App"

export default function NumbersButton({ dispatch, number }) {
  return (
    <button
      onClick={() => dispatch({ type: OPERATIONS.ADDITION, payload: { number } })}
    >
      {number}
    </button>
  )
}
