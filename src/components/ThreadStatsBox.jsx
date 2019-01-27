import React from "react";
import "./css/ThreadStatsBox.css";

import spaceOutNumber from "../helpers/spaceOutNumber";

function no() {
	console.log("no.");
	alert("no.");
}

const ThreadStatsBox = ({ data, handleVote, type }) => {
	// type: determine, if children are comments or replies; defaults to "Comments"
	return (
		<div className="ThreadStatsBox">
			<div>
				<small>
					<span>{ `${spaceOutNumber(data.num_comments) || 0} ${type || "Comments"}` }</span>
				</small>
				<small className="score-mobile">
					<span>
						<i className="fas fa-arrow-up" name={ data.name } onClick={ handleVote || no }></i>
						{ ` ${spaceOutNumber(data.score)} Upvotes ` }
						<i className="fas fa-arrow-down" name={ data.name } onClick={ handleVote || no }></i>
					</span>
				</small>
			</div>
			<MediaLink url={ data.url } />
		</div>
	);
}

export default ThreadStatsBox;

const MediaLink = ({ url }) => {
	if (url && url.slice(0, 23) !== "https://www.reddit.com/") {
		return (
			<div className="media-link">
				<a href={ url } target="_blank" rel="noopener noreferrer">
					<i className="fas fa-link"></i> 
					<span>{ url.split("/")[2] }</span>
				</a>
			</div>
		);		
	} else {
		return null;
	}
}

