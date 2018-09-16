const readOutLoud = (message) => {
    const speech = new SpeechSynthesisUtterance();

	    // Set text and voice attributes
	    speech.text = message;
	    speech.volume = 1;
	    speech.rate = 1;
	    speech.pitch = 1;
	    speech.onend = () => {
	    	console.log("SPEECH END!")
	    }
	    speech.onpause = () => {
	    	console.log("SPEECH PAUSE!")
	    	console.log(speech)
	    }
	    window.speechSynthesis.speak(speech);
}

export default readOutLoud;
    