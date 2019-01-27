function spaceOutNumber(nbr) {
	if (!nbr || nbr < 1000) return nbr;

	// convert to array
	nbr = nbr.toString().split("");

	// add space after 3 digits
	const spacedOut = nbr.map((digit, i) => {
		if (i === 0) return digit;

		// subtract i from length bc it starts at 0 and goes up
		if ((nbr.length - i) % 3 === 0) return ` ${digit}`;
		return digit;
	})

	return spacedOut.join("");
}

export default spaceOutNumber;