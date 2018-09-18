import React from "react";
import "./css/Synth.css";

import readOutLoud from "../helpers/readOutLoud";

const Synth = ({ toRead }) => {

	return (
		<div className="Synth">
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-play" id="playbtn" onClick={ () => playbutton(window.speechSynthesis, toRead) } ></i>
			</div>
			</div>
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-angle-double-right" onClick={ () => alert("SKIP: TO DO") } ></i>
			</div>
			</div>
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-stop" onClick={ () => {window.speechSynthesis.cancel();document.getElementById("playbtn").className="fas fa-play"} } ></i>
			</div>
			</div>

		{/*TEST BUTTON: ALWAYS STARTS READING OUT*/}
			<div  className="synth-button">
			<div className="inner">
				<i className="fas fa-volume-down" onClick={ () => readOutLoud(toRead) } ></i>
			</div>
			</div>
		</div>
	);
}

export default Synth;

const playbutton = (synth, toRead) => {
	console.log(synth);
	const playbtn = document.getElementById("playbtn");
	console.log(playbtn);

	if (!synth.speaking) {
		readOutLoud(toRead);
		playbtn.className = "fas fa-pause";
	} else if (synth.paused) {
		synth.resume();
		playbtn.className = "fas fa-pause";
	} else if (synth.speaking && !synth.paused) {
		synth.pause();
		playbtn.className = "fas fa-play";
	} else { 
		alert("ERROR");
	};
}