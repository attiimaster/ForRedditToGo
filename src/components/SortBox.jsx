import React from "react";
import "./css/SortBox.css";

const SortBox = ({ onChange, values, active }) => {
	return (
		<div className="SortBox">
			<span>Sort by</span>
			<select onChange={ onChange } value={ active }>
				{ values && values.map((v, i) => <option value={ v.toLowerCase() } key={i} >{ v }</option>) }
			</select>
		</div>
	);
}

export default SortBox;