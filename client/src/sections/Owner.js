import React from 'react'

export default function Owner({claimExit, registerParking, ifRegistered = false, parkersList= [] }) {
  return (
    <div>
      <h1> Owner </h1>
      <div>
        {
          ifRegistered
          ? <div>
              {
                parkersList.map( (parker, key) => <div key={key}>
                    {parker.name}
                    {parker.amt}
                    <button onClick={claimExit}>
                      Confirm Exit
                    </button>
                  </div>)
              }
            </div>
          :<div>
            <button onClick={registerParking}>
              Register now
            </button>
            </div>
        }
      </div>
    </div>
  )
}
