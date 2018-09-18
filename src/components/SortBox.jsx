import React from "react";
import "./css/SortBox.css";

const SortBox = ({ onChange }) => {
	return (
		<div className="SortBox">
			<span>Sort by</span>
			<select onChange={ onChange } >
				<option value="hot">Hot</option>
				<option value="top">Top</option>
				<option value="new">New</option>
				<option value="controversial">Contoversial</option>
			</select>
		</div>
	);
}

export default SortBox;