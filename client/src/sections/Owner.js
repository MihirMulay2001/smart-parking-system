import React from 'react'

export default function Owner({claimExit, registerParking, ifRegisteredFunc, ifRegistered, parker }) {

  React.useEffect(()=>{
      ifRegisteredFunc()
    }, [])
  const [ownerInfo, setOwnerInfo] = React.useState({
    noOfParkingSpots: 0,
    billAmt : 0,
    timeout: 0
  })
  const handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target
    setOwnerInfo( ownerInfo => ({
      ...ownerInfo,
      [name] : value
      
    })
    )
  }
  async function _registerParking(e){
    e.preventDefault();
    await registerParking(ownerInfo.noOfParkingSpots, ownerInfo.billAmt, ownerInfo.timeout)
    console.log("success");
  }
  return (
    <div>
      <h1> Owner </h1>
      <div>
        {
          ifRegistered
          ? <div>
              { <div>
                    {parker.name}
                    {parker.amt}
                    <button onClick={claimExit}>
                      Confirm Exit
                    </button>
                  </div>
              }
            </div>
          :<div>
            <div>
              <label>Number of parking spots</label>
              <input type="text" name="noOfParkingSpots" value={ownerInfo.noOfParkingSpots} 
              onChange={handleChange} placeholder='10'/>
            </div>
            <div>
              <label>Bill amount (in ether)</label>
              <input type="text" placeholder='0.02' name="billAmt" 
              value={ownerInfo.billAmt} onChange={handleChange}/>
            </div>

            <div>
              <label>Timeout (in minutes)</label>
              <input type="text" placeholder='10' name="timeout" 
              value = {ownerInfo.timeout} onChange={handleChange} />
            </div>

            <button onClick={_registerParking}>
              Register now
            </button>
            </div>
        }
      </div>
    </div>
  )
}
