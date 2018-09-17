const readOutLoud = (message) => {
    const speech = new SpeechSynthesisUtterance();

	const synth = window.speechSynthesis;
	const voices = synth.getVoices();

	// Set text and voice attributes
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
	speech.voice = voices[0];

	// Listen for Events
	speech.onend = () => console.log("SPEECH END!");
	speech.onpause = () => console.log("SPEECH PAUSE!");
	speech.onresume = () => console.log("SPEECH RESUME!");
	speech.onerror = () => console.log("SPEECH ERROR!");
	
	// start playback
	synth.speak(speech);
}

export default readOutLoud;
    