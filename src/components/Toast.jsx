import React from "react";
import "../styles/Toast.css";

const Toast = ({ message, show }) => {
  if (!show) return null;

  return <div className="toast">{message}</div>;
};

export default Toast;
