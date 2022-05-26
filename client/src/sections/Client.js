import React from 'react'

export default function Client( {exitParking, getBalance, inTime , outTime,
  showButton, enterParking, amount}) {

    
    const _enterParking = async (e) => {
      e.preventDefault();
      enterParking(document.getElementById('owneraddress').value);
    }

  return (
    <div>
      <h1> Parker </h1>
        <div>
          {
            showButton && <div>
              <label>Enter owner address</label>
              <input type={"text"} id="owneraddress" placeholder="0x9764ma4bc3...." />
              <button onClick={_enterParking}>
              Enter parking
              </button>
            </div>
          }
          {
            !showButton &&
            <div>
              <button onClick={exitParking}>
              Leave parking
              </button>
              <div>
              <b>Amount signed:</b> {amount} ether
            </div>
            <div>
              <b>In Time: </b>{inTime}
            </div>
            <div>
              { outTime && <><b>Out Time : </b>{outTime}</>}
            </div>
            <div>
            {
              outTime && <div> <b>Total amount:</b> {amount} </div> 
            }
            </div>
          </div>
          }
        </div>
    </div>
  )
}
