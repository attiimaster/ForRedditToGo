// print to Log
const print = toPrint => {
	const log = document.getElementById("log");
	log && log.insertAdjacentHTML("beforeend", `<small><b>${toPrint}</b></small>`);
}

export default print;
    