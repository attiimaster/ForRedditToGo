const getHashValue = key => {
	// if (!key)
  	const matches = window.location.hash.match(new RegExp(key+'=([^&]*)'));
  	return matches ? matches[1] : null;
}

export default getHashValue;