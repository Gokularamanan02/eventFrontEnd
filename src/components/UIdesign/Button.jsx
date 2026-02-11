import React from "react";

const Button = ({ children, ...props }) => {
  return (
    <button {...props} className="btn">
      {children}
    </button>
  );
};

export default React.memo(Button);
