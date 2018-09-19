const readOutLoud = (message) => {
	console.log("readOutLoud");
    const speech = new SpeechSynthesisUtterance();

	const synth = window.speechSynthesis;
	const voices = synth.getVoices();
	console.log(voices);
	console.log(window.speechSynthesis.getVoices());

	const log = document.getElementById("log");
	
	for (let i=0; i<voices.length; i++) {
		log.insertAdjacentHTML("beforeend", `<small><b>name:</b> ${voices[i].name}</small>`);
		log.insertAdjacentHTML("beforeend", `<small>voiceURI: ${voices[i].voiceURI}</small>`);
		log.insertAdjacentHTML("beforeend", `<small>localService: ${voices[i].localService}</small>`);
	}

	// Set text and voice attributes
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
	speech.voice = voices[0];

	// Register Event Handlers
	speech.onstart = () => {
		console.log("SPEECH START!");
		print("SPEECH started.");
	}
	speech.onend = () => {
		console.log("SPEECH END!");
		print("SPEECH ended.");
	}
	speech.onpause = () => {
		console.log("SPEECH PAUSE!");
		print("SPEECH paused.");
	}
	speech.onresume = () => {
		console.log("SPEECH RESUME!");
		print("SPEECH resumed.");
	}
	speech.onerror = () => {
		console.log("SPEECH ERROR!");
		print("SPEECH ERROR!");
	}
	
	// start playback
	synth.speak(speech);
}

export default readOutLoud;

// print to Log
const print = toPrint => {
	const log = document.getElementById("log");
	log.insertAdjacentHTML("beforeend", `<small><b>${toPrint}</b></small>`);
}
    