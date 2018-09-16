import React from "react";
import "./css/ControlTab.css";

const ControlTab  = props => {
	return (
		<div className="ControlTab">
			<div className="controlBtns"><div><i className="fas fa-stop-circle"></i></div></div>
			<div className="controlBtns"><div><i className="fas fa-play-circle"></i></div></div>
			<div className="controlBtns"><div><i className="fas fa-caret-up"></i></div></div>
			<div className="controlBtns"><div><i className="fas fa-caret-down"></i></div></div>
			<div className="controlBtns"><div><i className="fas fa-caret-right"></i></div></div>
		</div>
	);
}

export default ControlTab;