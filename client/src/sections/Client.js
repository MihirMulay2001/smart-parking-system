import React from 'react'

export default function Client( {exitParking, getBalance, inTime , outTime,
  showButton, enterParking, amount}) {
  return (
    <div>
      <h1> Parker </h1>
        <div>
          {
            showButton && <button onClick={enterParking}>
            Enter parking
            </button>
          }
            
            <button onClick={exitParking}>
            Leave parking
            </button>
        </div>
        <div>
          <div>
            <b>Amount signed:</b> {amount} ether
          </div>
          <div>
            <b>In Time: </b>{inTime}
          </div>
          <div>
            { outTime && <><b>Out Time : </b>{outTime}</>}
          </div>
          {
            outTime && <div> <b>Total amount:</b> {amount} </div> 
          }
        </div>
    </div>
  )
}
