import React, { useState } from "react";
import "./App.css";
import { Form } from "./components/Form";
import { LoginPage } from "./components/LoginPage";
import { ParkingInterface } from "./components/ParkingInterface";
import useContract from "./hooks/useContract";
// import {bottom_img} from "/bottom_img.svg"

function App() {
  const {
    web3,
    enterParking,
    contract,
    inTime,
    outTime,
    registerParking,
    ifRegisteredFunc,
    exitParking,
    claimExit,
    getBalance,
    showButton,
    amount,
    parker,
    ifRegistered,
  } = useContract();
  //This will choose whether to render Login screen or not
  const [login, setLogin] = useState(false);

  //for choosing user type between client and owner
  const [userType, setUserType] = useState("Owner");

  //click handle function for login page
  const goBackClick = (buttonProps) => {
    // The function at button level evokes an object with atts {buttonName, buttonText}
    console.log(buttonProps);
    const { buttonName } = buttonProps;
    // console.log(userType + buttonName)
    setUserType(() => buttonName);
    if (buttonProps.buttonText === "Go back") setLogin(false);
    else setLogin(true);
    // console.log(userType)
  };

  //click handle for UI
  const interfaceHandleClick = ({ buttonText }) => {
    // The function at button level evokes an object with atts {buttonName, buttonText}
    // if (buttonText === "Register Now") setLogin(false);
    if (
      buttonText === "Enter Parking" ||
      buttonText === "Leave Parking" ||
      buttonText === "Confirm Exit"
    )
      console.log("Parking Entered!!");
    else setLogin(false);
  };

  return (
    <div className="App">
      {/* Renders Login page 
          Pass in handle Click function down to components
      
      */}
      {!login && <LoginPage handleClick={goBackClick} />}

      {/* Renders UI 
          Pass in handle Click function down to components
      */}
      {login && (
        <ParkingInterface
          handleClick={interfaceHandleClick}
          loginHandleClick={goBackClick}
          userType={userType}
          showButton={showButton}
          enterParking={enterParking}
          inTime={inTime}
          exitParking={exitParking}
          getBalance={getBalance}
          amount={amount}
          outTime={outTime}
          claimExit={claimExit}
          registerParking={registerParking}
          parker={parker}
          ifRegisteredFunc={ifRegisteredFunc}
          ifRegistered={ifRegistered}
        />
      )}
    </div>
  );
}

export default App;
