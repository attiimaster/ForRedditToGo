import React, { Component } from "react";
import "./css/Synth.css";

import { readOut, convertListingToScript } from "../services/speech.service.js";
import print from "../helpers/print";

class Synth extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			logIsOpen: false, 
			listing: null,
			readmode: "STANDARD", // STANDARD, TOP_COMMENTS, COMMENT_TREE
			script: null,
			position: 0,
			isOn: false
		};
		this.handleLog = this.handleLog.bind(this);
		this.handleReadMode = this.handleReadMode.bind(this);
		this.play = this.play.bind(this);
		this.back = this.back.bind(this);
		this.skip = this.skip.bind(this);
		this.stop = this.stop.bind(this);
	}
	componentDidMount() {
		const { listing } = this.props;
		listing && this.setState({ listing });
	}

	// button handlers
	play(e) {
		const { listing, position, readmode } = this.state;
		
		// START
		if (!window.speechSynthesis.speaking) {
			print("START EVENT");

			// convert listing to an array of strings
			// where each item represents one title, post, comment or reply
			const script = convertListingToScript(listing, readmode);

			// push all items onto the utterance queue with a callback
			mapScriptToUtteranceQueue(position, script, (err, e) => {
				this.setState({ position: this.state.position + 1 });
			});

			// set state to track position for back and skip functionality
			this.setState({ isOn: true, script, position });

		// PAUSE
		} else {
			print("TOGGLE PAUSE EVENT");
			window.speechSynthesis.cancel();

			// cancel() increments position once, see readOut callback
			this.setState({ isOn: false, position: position - 1 });  
		}
	}
	back(e) {
		print("BACK EVENT");
		const { script, position } = this.state;
		const previous = position < 2 ? 0 : position - 1;

		mapScriptToUtteranceQueue(previous, script, (err, e) => {
			this.setState({ position: this.state.position + 1 });
		});
		
		// cancel() increments position once, see readOut callback 	
		if (window.speechSynthesis.speaking) {
			this.setState({ position: previous - 1, isOn: true });  
		} else {
			this.setState({ position: previous, isOn: true });  
		}
	}
	skip(e) {
		print("SKIP EVENT");
		const { script, position } = this.state;
		const next = position + 1;

		mapScriptToUtteranceQueue(next, script, (err, e) => {
			this.setState({ position: this.state.position + 1 });
		});

		// cancel() increments position once, see readOut callback
		if (window.speechSynthesis.speaking) {
			this.setState({ position: next - 1, isOn: true });
		} else {
			this.setState({ position: next, isOn: true });
		}
	}
	stop(e) {
		print("STOP EVENT");
		const { isOn } = this.state;
		window.speechSynthesis.cancel();

		// cancel() increments position once, see readOut callback
		// isOn to prevent multiple clicks
		isOn && this.setState({ isOn: false, position: -1, script: null }); 
	}

	handleLog(e) {
		this.setState({ logIsOpen: !this.state.logIsOpen });
	}

	handleReadMode(e) {
		this.setState({ readmode: e.target.value });
	}

	render() {
		const { logIsOpen, isOn, readmode, position, script } = this.state;

		return (
			<div className="Synth">

				<i onClick={ this.handleLog } className="fas fa-bars"></i>
				<div id="log" className={ logIsOpen ? "" : "hidden" }><p><u>DebugLog</u></p></div>
				<div className="synth-name">Synthesizer 2000</div>
			
				<div className="readmode">Mode: 
					<select onChange={ this.handleReadMode } value={ readmode } >
						<option value="STANDARD">Standard</option>
						<option value="TOP_COMMENTS">Top cmnts</option>
					</select>
					<span className="position">{ `${position} / ${script ? script.length : " - " }` }</span>
				</div>

				<div className="synth-btn-container">	
					<SynthBtn icon={ isOn ? "fas fa-pause" : "fas fa-play" } onClick={ this.play } />
	
					<SynthBtn icon="fas fa-backward" onClick={ this.back } />

					<SynthBtn icon="fas fa-forward" onClick={ this.skip } />
	
					<SynthBtn icon="fas fa-stop" onClick={ this.stop } />
				</div>
			</div>
		);
	}
}

export default Synth;

const SynthBtn = ({ icon, onClick }) => {
	return (
		<div  className="synth-btn" onClick={ onClick } >
			<i className={ icon } id="playbtn"></i>
		</div>
	);
}

function mapScriptToUtteranceQueue(position, script, done) {
	window.speechSynthesis.cancel();

	// slice complete script at new position and map to readOut
	script.slice(position, script.length).forEach(text => {
		text && readOut(text, (err, e) => {
			
			if (err) console.error(err);

			done(null, e);
		});
	});
}