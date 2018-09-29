import React from "react";
import convertToHoursAgo from "../helpers/convertToHoursAgo";
import { Link } from "react-router-dom";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

const AuthorHeader = props => {
	const { r, author, date } = props;
	const hoursAgoStr = convertToHoursAgo(date*1000);
	return (
		<small>
			<span  className="subreddit"><Link to={ `${uri}/${r}` }><b>{ r }</b></Link></span>
			<span  className="author"> &#8226; Posted by u/{ author }</span>
			<span  className="time"> &#8226; { hoursAgoStr }</span>
		</small>
	);
}

export default AuthorHeader;