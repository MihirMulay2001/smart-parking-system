import React from 'react'

export default function Client( {exitParking, getBalance, inTime , outTime,
  showButton, enterParking, amount}) {
  return (
    <div>
      <h1> Client </h1>
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
            Amount signed: {amount} ether
          </div>
          <div>
            In Time: {inTime}
          </div>
          <div>
            { outTime && <>Out Time : {outTime}</>}
          </div>
          {
            outTime && <div> Total amount: {amount} </div> 
          }
        </div>
    </div>
  )
}
