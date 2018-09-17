const readOutLoud = (message) => {
    const speech = new SpeechSynthesisUtterance();

	const synth = window.speechSynthesis;
	const voices = synth.getVoices();
	console.log(voices);

	// Set text and voice attributes
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
	speech.voice = voices[0];
	
	speech.onend = () => {
		console.log("SPEECH END!")
	}
	speech.onpause = () => {
		console.log("SPEECH PAUSE!")
		console.log(speech)
	}
	speech.onerror = () => {
		console.log("SPEECH ERROR!")
		console.log(speech)
	}
	synth.speak(speech);
}

export default readOutLoud;
    