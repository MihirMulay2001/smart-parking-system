import React from "react";
import { Form } from "./Form";

export const LoginPage = ({ handleClick }) => {
  return (
    <div className="page">
      {/* Houses all the buttons for login page */}
      <Form handleClick={handleClick} />
    </div>
  );
};
