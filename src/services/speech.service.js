import print from "../helpers/print";

let synth;
let voice;

// load voices, and try again if it fails
let tries = 0;
const loadVoices = () => {
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

if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  loadVoices();
}
// done takes (err, event)
export const readOut = (message, done) => {
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

export default readOut;
