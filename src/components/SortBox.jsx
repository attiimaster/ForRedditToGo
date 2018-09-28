import React from "react";
import "./css/SortBox.css";

// active.value === sort value like hot, top, controversial
// active.top === sort value for top like week, month, all

const SortBox = ({ onChange, values, active }) => {
	return (
		<form className="SortBox" onChange={ onChange }>
			<span>Sort by</span>
			<select value={ active.value || active }>
				{ values && values.map((v, i) => <option value={ v.toLowerCase() } key={i} >{ v }</option>) }
			</select>

			{ active.top &&
			<select value={ active.top } className={ active.value === "top" ? "SortBox-top SortBox-top-active" : "SortBox-top" }>
				{ topValues.map((v, i) => <option value={ v.toLowerCase() } key={i} >{ v }</option>) }
			</select>
			}
		</form>
	);
}

export default SortBox;

const topValues = ["Hour", "Day", "Week", "Month", "Year", "All"];