import React from "react";

const MoreButton = ({ onClick, text, data }) => {
	// data && to prevent crash when using the search feature
	const children = data && data.children;
	const parentId = data && data.parent_id;

	return (
		<button onClick={ e => onClick(e, children, parentId) } className="MoreButton">{ `${text}` }</button>
	);
}

export default MoreButton;