import React from "react";

const MoreButton = ({ onClick, text }) => {
	return (
		<button onClick={ onClick } className="MoreButton">{ `${text}` }</button>
	);
}

export default MoreButton;