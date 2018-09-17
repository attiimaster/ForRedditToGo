import React from "react";
import convertToHoursAgo from "../helpers/convertToHoursAgo";

const AuthorHeader = props => {
	const { r, author, date } = props;
	const hoursAgoStr = convertToHoursAgo(date*1000);
	return (
		<small>
			<span  className="subreddit"><b>{ r }</b></span>
			<span  className="author"> &#8226; Posted by u/{ author }</span>
			<span  className="time"> &#8226; { hoursAgoStr }</span>
		</small>
	);
}

export default AuthorHeader;