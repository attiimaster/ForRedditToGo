import React from "react";
import "./css/SortBox.css";

const SortBox = ({ onChange, values }) => {
	return (
		<div className="SortBox">
			<span>Sort by</span>
			<select onChange={ onChange } >
				{ values && values.map((v, i) => <option value={ v.toLowerCase() } key={i} >{ v }</option>) }
			</select>
		</div>
	);
}

export default SortBox;