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
			synthState: "OFF"
		};
		this.handleLog = this.handleLog.bind(this);
		this.play = this.play.bind(this);
		this.skip = this.skip.bind(this);
		this.stop = this.stop.bind(this);
	}
	componentDidMount() {
		const { listing } = this.props;
		listing && this.setState({ listing });
	}

	// button handlers
	play(e) {
		const { listing, position } = this.state;
		const synth = window.speechSynthesis;
		
		// differentiate between
		// START || PAUSE || RESUME
		if (!synth.speaking) {
			print("START EVENT");
			const script = threadToArray(listing);
			print(`array length: ${listing.length}`);
			print(`array char count: ${add(script)} (32,767 max)`);
			this.setState({ synthState: "ON", script, position: 0 });

			script.map(text => {
				text && readOut(text, (err, e) => {
					this.setState({ position: this.state.position + 1 });
				});
			});
		} else if (synth.paused) {
			print("RESUME EVENT");
			synth.resume();
			this.setState({ synthState: "ON" });
		} else if (synth.speaking && !synth.paused) {
			print("PAUSE EVENT");
			synth.pause();
			this.setState({ synthState: "PAUSE" });
		} else { 
			print("PLAY DEFAULT EVENT");
			synth.cancel();
			this.setState({ synthState: "OFF" });
		};
	}
	skip(e) {
		print("SKIP EVENT");
		const { script, position } = this.state;
		const skip = position + 1;
		
		if (script) {
			window.speechSynthesis.cancel(); // cancel sets position + 1 (see: readOut callback)
	
			// slice complete script at current position + 1 and map to readOut
			script.slice(skip, script.length).map(text => {
				text && readOut(text, (err, e) => {
					this.setState({ position: this.state.position + 1 });
				});
			});
		} else {
			console.error(`SKIP ERROR:\nscript: ${script}\nposition: ${position}`);
		}
	}
	stop(e) {
		const synth = window.speechSynthesis;
		// synth.paused && synth.resume(); evtl ? 
		print("STOP EVENT");
		synth.cancel();
		this.setState({ synthState: "OFF", script: null, position: null });
	}

	handleLog(e) {
		this.state.logIsOpen ? 
		this.setState({ logIsOpen: false })
		:
		this.setState({ logIsOpen: true }); 
	}

	render() {
		const { logIsOpen, synthState } = this.state;

		return (
			<div className="Synth">

				<i onClick={ this.handleLog } className="fas fa-bars"></i>
				<div id="log" className={ logIsOpen ? "" : "hidden" }></div>
				
				<SynthBtn icon={ synthState === "ON" ? "fas fa-pause" : "fas fa-play" } onClick={ this.play } />

				<SynthBtn icon="fas fa-forward" onClick={ this.skip } />

				<SynthBtn icon="fas fa-stop" onClick={ this.stop } />

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



// sum of character count of an array for test purposes
const add = arr => {
	let sum = 0;
	arr.map(str => str && (sum += str.length));

	return sum;
}

/*
	this.state = { 
		listing: data, 
		parsedListing: parsedListing, 
		current: text,
		readmode: { TOPCOMMENTS || STANDARD || COMMENTTREE },
		{ ...else }
	}
	
	skip() {
		const { parsedListing, current } = this.state;
		synth.cancel();
		new = parsedListing.slice(current, .length)
		this.setState({ parsedListing: new, current: 0 });
		parsedListing.map(text => readOut(text, cb))
	}

	play() {
		check readmode;

		if readmode {
			parseListing();
		}
		let i = 0;
		synth.readOut(parsedListing[i], (i) => {
			this.setState({ current: i || text })
		});
	}
	
	speech.onend() { ???
		const { current } = this.state;
		const new = current.slice(1, current.length);
		this.setState({ current: new });

		//
		return arr number

		//
		callback
	}
*/

// temporary solution
let toReadArray = [];

// makes array of strings to pass to speechSynthesis;
const threadToArray = listing => {
	toReadArray = [];
	const title =  listing[0].data.children[0].data.title;
	const post = listing[0].data.children[0].data.selftext;
	const comments = listing[1].data.children;

	// push title, post and comments to array in order and read out
	title && toReadArray.push(title);
	post && toReadArray.push(post);

	// push comments and replies to array
	comments.map((c, i) => {
		toReadArray.push(` ? ${c.data.author} comments: ? ` + c.data.body);
		pushReplies(c.data.replies);
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

			// check that kind !== "more"
			if (c.kind !== "more") {

				// if not, push reply body to array
				toReadArray.push(` ? ${c.data.author} replies: ? ` + c.data.body);

				// call self with the replies of the reply
				pushReplies(c.data.replies);
			};
		});
	}
}