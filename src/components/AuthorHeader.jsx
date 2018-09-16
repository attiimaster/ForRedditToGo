import React from "react";

const AuthorHeader = props => {
	const { r, author, date } = props;
	const newDate = new Date(date*1000).toString();
	return (
		<small>
			<span  className="subreddit"><b>{ r }</b></span>
			<span  className="author"> &#8226; Posted by u/{ author }</span>
			<span  className="time"> &#8226; { newDate.slice(4, 21) }</span>
		</small>
	);
}

export default AuthorHeader;