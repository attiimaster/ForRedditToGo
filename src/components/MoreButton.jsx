import React from "react";

const MoreButton = (props) => {
	const { onClick, text } = props;
	const parent_id = props.data.parent_id;
	return (
		<button onClick={ e => onClick(e, parent_id) } className="MoreButton">{ `${text}` }</button>
	);
}

export default MoreButton;