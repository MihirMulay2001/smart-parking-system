import React from "react";
import { Button } from "./Button";

export const Form = ({ handleClick }) => {
  return (
    <div className="form--container">
      <h1 className="form--title">Welcome to Smart Parking systems</h1>

      <h4 className="form--subtitle">Please Choose a role below</h4>
      {/* Choice for picking user */}
      <div className="form--choice">
        {/* 
                    Passing down handleclick function
                    Passing down button text to display
                    Passing down buttonName for choosing color (come up with a better prop name)
                    This is the owner button

                */}
        <Button
          className={"form--button"}
          buttonName={"Owner"}
          buttonText={"Owner"}
          handleClick={handleClick}
          goBack={true}
        />
        {/* similar to above but for clients */}
        <Button
          className={"form--button"}
          buttonName={"Client"}
          buttonText={"Client"}
          handleClick={handleClick}
          goBack={true}
        />
      </div>
    </div>
  );
};
