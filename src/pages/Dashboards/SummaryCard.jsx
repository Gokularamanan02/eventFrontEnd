import React from "react";
import "../../styles/DashboardCards.css";
import "../../styles/SummaryCards.css";

const SummaryCard = ({ title, amount }) => {
  return (
    <div className="summary-card">
      <p>{title}</p>
      <h2>{amount}</h2>
    </div>
  );
};

export default SummaryCard;
