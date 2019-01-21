import print from "../helpers/print";

let synth;
let voice;

// load voices, and try again if it fails
let tries = 0;

if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  loadVoices();
}

function loadVoices() {
	tries++;
	const voices = synth.getVoices();
	if (voices.length) {
		voice = voices.find(v => /en[-_]US/.test(v.lang));	// regex because android
	}
	if (!voice) {
		if (tries < 10) {
			setTimeout(() => {
				loadVoices();
			}, 250);
		} else {
			console.error("en-US voice not found.");
		}
	}
}

// takes string and starts reading out lout
// done takes (err, event)
export function readOut(message, done) {
	console.log("readOut");
    const speech = new SpeechSynthesisUtterance(message);

    // find voice
	const voices = synth.getVoices();
	loadVoices();

	// Set text and voice attributes
	speech.lang = "en-US";
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
	speech.voice = voice;

	// Custom Error Handler
	speech.addEventListener("error", error => console.error(error));

	// Register Event Handlers
	speech.onstart = (e) => {
		print(`array char count: ${message.length} (32,767 max)`);
		console.log(e)
		console.log("SPEECH START!");
		print("SPEECH started.");
	}
	speech.onend = (e) => {
		console.log("SPEECH END!");
		print("SPEECH ended.");
		done && done(null, e);
	}
	speech.onpause = () => {
		console.log("SPEECH PAUSE!");
		print("SPEECH paused.");
	}
	speech.onresume = () => {
		console.log("SPEECH RESUME!");
		print("SPEECH resumed.");
	}
	speech.onerror = (e) => {
		console.log("SPEECH ERROR!");
		print(`SPEECH ERROR!`);
		done && done("ERROR reading out.", e);
	}
	
	// start playback
	synth.speak(speech);
}

// makes array of strings to pass to speechSynthesis;
export function convertListingToScript(listing, readmode) {
	let script = [];

	const title =  listing[0].data.children[0].data.title;
	const post = listing[0].data.children[0].data.selftext;
	const comments = listing[1].data.children;

	// push title, post and comments to array in order and read out
	title && script.push(cleanString(title));
	post && script.push(cleanString(post));

	// push comments and replies to array
	comments.map((c, i) => {
		script.push(` ${c.data.author} comments: ? ` + cleanString(c.data.body));
		
		if (readmode === "STANDARD") {
			pushReplies(c.data.replies, script);
		}
	});
	return script;
}

// recursively add replies to script array
function pushReplies(replies, script) {

	if (replies && replies.kind !== "more") {

		// the replies object is a "listing" and NOT the actual array
		const children = replies.data.children;

		// loop over children
		children.map((child, i) => {

			// check if actual replies and not just links to fetch more replies
			if (child.kind !== "more") {

				// if it is push reply body to array
				script.push(` ${child.data.author} replies: ? ` + cleanString(child.data.body));

				// call self with the replies of the reply
				pushReplies(child.data.replies, script);
			};
		});
	}
	
}

// remove special symbols from strings by defining what NOT to remove
function cleanString(str) {
	if (!str) {
		return null;
	}
	return str.replace(/[^\w\s.:,_$@%;-=`´'/!?]/gi, '');
}