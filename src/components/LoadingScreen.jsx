import React from "react";
import "./css/LoadingScreen.css";

const LoadingScreen = () => {
	return (
		<div className="LoadingScreen">
		<div>
			<h1>LOADING</h1>
			<div className="spinner"></div>
		</div>
		</div>
	);
}

export default LoadingScreen;