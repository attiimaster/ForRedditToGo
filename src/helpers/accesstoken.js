// accesstoken methods

export default {
	get,
	set,
	remove
}

function set(token) {
    localStorage.setItem("access_token", JSON.stringify(token));
}

function get() {
	return JSON.parse(localStorage.getItem("access_token"));
}

function remove() {
	localStorage.removeItem("access_token");
}