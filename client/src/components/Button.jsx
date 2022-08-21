import React from "react";

export const Button = ({
  buttonName,
  clickFunc,
  className,
  handleClick,
  buttonText,
  goBack,
}) => {
  return (
    // Button component
    <button
      // setting classname for styling
      className={className}
      // Chainging color based on userType
      style={{
        background: buttonName === "Owner" ? "#052B12" : "#267693",
      }}
      //invoking click function seding a object as function parameter
      onClick={(e) => {
        if (clickFunc) clickFunc(e);
        if (goBack) {
          handleClick({ buttonName: buttonName, buttonText: buttonText });
        }
      }}
    >
      {buttonText}
    </button>
  );
};
