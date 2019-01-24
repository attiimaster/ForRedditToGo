import React from "react";
import { Link } from "react-router-dom";
import "./css/ToFrontpageBtn.css";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

const ToFrontpageBtn = () => {
  return (
    <div className="to-frontpage-container">
      <Link to={`${uri}/frontpage`}>
        <button className="to-frontpage-btn">To the frontpage</button>
      </Link>
    </div>
  );
}

export default ToFrontpageBtn;