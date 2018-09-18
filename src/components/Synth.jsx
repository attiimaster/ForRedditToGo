import React from "react";
import "./css/Synth.css";

import readOutLoud from "../helpers/readOutLoud";

const Synth = ({ toRead }) => {
	return (
		<div className="Synth">
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-play" onClick={ () => window.speechSynthesis.pending ? window.speechSynthesis.resume() : readOutLoud(toRead) } ></i>
			</div>
			</div>
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-pause" onClick={ () => window.speechSynthesis.pause() } ></i>
			</div>
			</div>
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-angle-double-right" onClick={ () => alert("SKIP: TO DO") } ></i>
			</div>
			</div>
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-stop" onClick={ () => window.speechSynthesis.cancel() } ></i>
			</div>
			</div>
		</div>
	);
}

export default Synth;