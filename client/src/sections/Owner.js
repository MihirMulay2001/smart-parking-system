import React from 'react'

export default function Owner({claimExit}) {
  return (
    <div>
      <h1> Owner </h1>
      <button onClick={claimExit}>
        confirm exit
      </button>

    </div>
  )
}
