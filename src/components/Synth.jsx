import React, { Component } from "react";
import "./css/Synth.css";

import readOutLoud from "../services/speech.service.js";
import print from "../helpers/print";

class Synth extends Component {
	constructor(props) {
		super(props);
		this.state = { logIsOpen: false, toRead: ["Test", "Phrase"] };
		this.handleLog = this.handleLog.bind(this);
		this.handlePlayButton = this.handlePlayButton.bind(this);
		this.handleSkipButton = this.handleSkipButton.bind(this);
		this.handleStopButton = this.handleStopButton.bind(this);
		this.handleTestButton = this.handleTestButton.bind(this);
	}
	componentDidMount() {
		console.log(this.props)
		const { toRead } = this.props;
		toRead && this.setState({ toRead });
	}

	// button handlers
	handlePlayButton(e) {
		// playbutton(window.speechSynthesis, this.state.toRead);
		const synth = window.speechSynthesis;
		
		// differentiate between
		// START || PAUSE || RESUME
		if (!synth.speaking) {
			print("START EVENT");
			readOutLoud(this.state.toRead);
			this.setState({ synthState: "ON" });
		} else if (synth.paused) {
			print("RESUME EVENT");
			synth.resume();
			this.setState({ synthState: "ON" });
		} else if (synth.speaking && !synth.paused) {
			print("PAUSE EVENT");
			synth.pause();
			this.setState({ synthState: "PAUSE" });
		} else { 
			print("ERROR EVENT");
			alert("ERROR");
		};
	}
	handleSkipButton(e) {
		print("SKIP EVENT");
		alert("SKIP: TO DO");
	}
	handleStopButton(e) {
		const synth = window.speechSynthesis;
		// synth.paused && synth.resume(); evtl ? 
		print("STOP EVENT");
		synth.cancel();
		this.setState({ synthState: "OFF" });
	}
	handleTestButton(e) {
		print("TEST EVENT");
		readOutLoud(this.state.toRead);
		this.setState({ synthState: "ON" });
	}

	handleLog(e) {
		this.state.logIsOpen ? 
		this.setState({ logIsOpen: false })
		:
		this.setState({ logIsOpen: true }); 
	}

	render() {
		const { logIsOpen, synthState } = this.state;

		// log character count for test purposes
		const add = arr => {
			let sum = 0;
			arr.map(str => str && (sum += str.length));

			return sum;
		}
		console.log(`array length: ${this.state.toRead.length}`);
		console.log(`array char count: ${add(this.state.toRead)}`);

		return (
			<div className="Synth">

				<i onClick={ this.handleLog } className="fas fa-bars"></i>
				<div id="log" className={ logIsOpen ? "" : "hidden" }></div>
				
				<SynthBtn icon={ synthState === "ON" ? "fas fa-pause" : "fas fa-play" } onClick={ this.handlePlayButton } />

				<SynthBtn icon="fas fa-angle-double-right" onClick={ this.handleSkipButton } />

				<SynthBtn icon="fas fa-stop" onClick={ this.handleStopButton } />

				<SynthBtn icon="fas fa-volume-down" onClick={ this.handleTestButton } />

			</div>
		);
	}
}

export default Synth;

const SynthBtn = ({ icon, onClick }) => {
	return (
		<div  className="synth-button">
			<div className="inner">
				<i className={ icon } id="playbtn" onClick={ onClick } ></i>
			</div>
		</div>
	);
}