import React from "react";
import { Button } from "./Button";

export const Card = ({
  handleClick,
  userType,
  loginHandleClick,
  claimExit,
  registerParking,
  ifRegisteredFunc,
  ifRegistered,
  parker,
  exitParking,
  getBalance,
  inTime,
  outTime,
  showButton,
  enterParking,
  amount,
}) => {
  //   React.useEffect(() => {
  //     ifRegisteredFunc();
  //   }, []);
  const [ownerInfo, setOwnerInfo] = React.useState({
    noOfParkingSpots: 0,
    billAmt: 0,
    timeout: 0,
  });
  const [ownerAddr, setOwnerAddr] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setOwnerInfo((ownerInfo) => ({
      ...ownerInfo,
      [name]: value,
    }));
  };
  async function _registerParking(e) {
    e.preventDefault();
    await registerParking(
      ownerInfo.noOfParkingSpots,
      ownerInfo.billAmt,
      ownerInfo.timeout
    );
    console.log("success");
  }

  async function _enterParking(e) {
    e.preventDefault();
    if (ownerAddr) await enterParking(ownerAddr);
    else console.log("no address");
  }
  // console.log(userType)

  return (
    <div className="card--container">
      <div className="card--header">
        <h3>{userType}</h3>
      </div>
      <div className="card--body">
        {/* render only if client */}
        {userType === "Client" && (
          <div className="card--info">
            {/* fill in with dynamic data later */}
            <h4>{`Amount signed: ${amount} ether`}</h4>
            <h4>{`In Time: ${inTime}`}</h4>
          </div>
        )}
        {/* render only if client */}
        {userType === "Client" ? (
          <div className="client--buttons">
            <input
              type="text"
              name="ownerAddr"
              palceholder="0x32434..."
              value={ownerAddr}
              onChange={(e) => {
                e.preventDefault();
                setOwnerAddr(e.target.value);
              }}
            />
            <Button
              buttonName={userType}
              buttonText={"Enter Parking"}
              className={"card--button"}
              clickFunc={_enterParking}
              handleClick={handleClick}
              goBack={false}
            />

            <Button
              buttonName={userType}
              buttonText={"Leave Parking"}
              className={"card--button"}
              clickFunc={exitParking}
              handleClick={handleClick}
              goback={false}
            />

            <Button
              buttonText={"Go back"}
              handleClick={loginHandleClick}
              className={"card--button"}
              goBack={true}
            />
          </div>
        ) : (
          <div>
            <div>
              <label>Number of parking spots</label>
              <input
                type="text"
                name="noOfParkingSpots"
                value={ownerInfo.noOfParkingSpots}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
            <div>
              <label>Bill amount (in ether)</label>
              <input
                type="text"
                placeholder="0.02"
                name="billAmt"
                value={ownerInfo.billAmt}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Timeout (in minutes)</label>
              <input
                type="text"
                placeholder="10"
                name="timeout"
                value={ownerInfo.timeout}
                onChange={handleChange}
              />
            </div>
            <Button
              buttonText={"Register Parking"}
              handleClick={loginHandleClick}
              goBack={true}
              className={"card--button"}
              onClick={_registerParking}
            />
            <Button
              buttonText={"Go back"}
              handleClick={loginHandleClick}
              className={"card--button"}
              goBack={true}
            />
            <Button //for owner
              buttonName={userType}
              buttonText={"Confirm Exit"}
              className={"card--button"}
              clickFunc={claimExit}
              handleClick={handleClick}
              goBack={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
