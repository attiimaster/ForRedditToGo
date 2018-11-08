import React, { Component } from "react";
import "./css/Synth.css";

import readOut from "../services/speech.service.js";
import print from "../helpers/print";

class Synth extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			logIsOpen: false, 
			listing: null,
			readmode: "STANDARD", // STANDARD, TOP_COMMENTS, COMMENT_TREE
			script: null,
			position: null,
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
		const { listing, readmode } = this.state;

		const synth = window.speechSynthesis;
		
		// START
		if (!synth.speaking) {
			print("START EVENT");

			// convert listing to an array of strings
			// where each item represents one title, post, comment or reply
			const script = threadToArray(listing, readmode);

			// push all items onto the utterance queue with a callback
			script.map(text => {
				text && readOut(text, (err, e) => {
					this.setState({ position: this.state.position + 1 });
				});
			});

			// set state to track position for back and skip functionality
			this.setState({ isOn: true, script, position: 0 });

		// RESUME
		} else if (synth.paused) {
			print("RESUME EVENT");
			synth.resume();
			this.setState({ isOn: true });

		// PAUSE
		} else if (synth.speaking && !synth.paused) {
			print("PAUSE EVENT");
			synth.pause();
			this.setState({ isOn: false });

		// DEFAULT
		} else { 
			print("PLAY DEFAULT EVENT");
			synth.cancel();
			this.setState({ isOn: false });
		};
	}
	back(e) {
		print("BACK EVENT");
		const { script, position } = this.state;
		const previous = position < 2 ? 0 : position - 1;

		if (script) {
			window.speechSynthesis.cancel(); // cancel sets position + 1 (see: readOut callback)

			// slice complete script at current position - 1 and map to readOut
			script.slice(previous, script.length).map(text => {
				text && readOut(text, (err, e) => {
					this.state.isOn && this.setState({ position: this.state.position + 1 });
				});
			});
			
			this.setState({ position: previous - 1 }); // see the cancel() comment 

		} else {
			console.error(`BACK ERROR:\nscript: ${script}\nposition: ${position}`);
		}
	}
	skip(e) {
		print("SKIP EVENT");
		const { script, position } = this.state;
		const next = position + 1;

		if (script) {
			window.speechSynthesis.cancel(); // cancel sets position + 1 (see: readOut callback)
	
			// slice complete script at current position + 1 and map to readOut
			script.slice(next, script.length).map(text => {
				text && readOut(text, (err, e) => {
					this.state.isOn && this.setState({ position: this.state.position + 1 });
				});
			});
			// this.setState({ position: next });
		} else {
			console.error(`SKIP ERROR:\nscript: ${script}\nposition: ${position}`);
		}
	}
	stop(e) {
		print("STOP EVENT");
		window.speechSynthesis.cancel();
		this.setState({ isOn: false, script: null, position: null });
	}

	handleLog(e) {
		this.state.logIsOpen ? 
		this.setState({ logIsOpen: false })
		:
		this.setState({ logIsOpen: true }); 
	}

	handleReadMode(e) {
		this.setState({ readmode: e.target.value });
	}

	render() {
		const { logIsOpen, isOn, readmode } = this.state;

		return (
			<div className="Synth">

				<i onClick={ this.handleLog } className="fas fa-bars"></i>
				<div id="log" className={ logIsOpen ? "" : "hidden" }><p><u>DebugLog</u></p></div>
				<div className="synth-name">Synthesizer 2000</div>
			
				<div className="readmode">Mode: 
					<select onChange={ this.handleReadMode } value={ readmode } >
						<i className="fas fa-ellipsis-h"></i>
						<option value="STANDARD">Standard</option>
						<option value="TOP_COMMENTS">Top cmnts</option>
					</select>
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



// temporary solution
let toReadArray = [];
const cleanString = str => str ? str.replace(/[^\w\s.:,_$@%;-=!?]/gi, '') : null;

// makes array of strings to pass to speechSynthesis;
const threadToArray = (listing, readmode) => {
	toReadArray = [];

	const title =  listing[0].data.children[0].data.title;
	const post = listing[0].data.children[0].data.selftext;
	const comments = listing[1].data.children;

	// push title, post and comments to array in order and read out
	title && toReadArray.push(cleanString(title));
	post && toReadArray.push(cleanString(post));

	// push comments and replies to array
	comments.map((c, i) => {
		toReadArray.push(` ${c.data.author} comments: ? ` + cleanString(c.data.body));
		
		if (readmode === "STANDARD") {
			pushReplies(c.data.replies);
		}
	});
	return toReadArray;
}

// recursive function
const pushReplies = replies => {

	if (replies && replies.kind !== "more") {

		// the replies object is a "listing" and NOT the actual array
		const children = replies.data.children;

		// loop over children
		children.map((c, i) => {

			// check if actual replies and not just links to fetch more replies
			if (c.kind !== "more") {

				// if it is push reply body to array
				toReadArray.push(` ${c.data.author} replies: ? ` + cleanString(c.data.body));

				// call self with the replies of the reply
				pushReplies(c.data.replies);
			};
		});
	}
}