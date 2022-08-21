import React from "react";
import { Card } from "./Card";
import { useState } from "react";

export const ParkingInterface = ({
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
  return (
    <div className="parking--interface">
      {/* 
                card shows info about user and their options 
                passing down handle click for button
                passing down usertype for button
            */}
      <Card
        handleClick={handleClick}
        userType={userType}
        loginHandleClick={loginHandleClick}
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
    </div>
  );
};
