import React from "react";
import { Link } from "react-router-dom";
import "./css/SubRedditTab.css";


const SubRedditTab  = ({ subreddits }) => {
	return (
		<div className="SubRedditTab">
			{ subreddits && subreddits.map((sub, i) => <SubRedditBox key={i} { ...sub } />)}
		</div>
	);
}

const SubRedditBox = props => {
	const { data } = props;
	return (
		<Link to={ `/r/${data.display_name}` } className="subreddit-box">
			<div className="subreddit-box-img" style={{ backgroundImage: `url(${data.header_img})` }}></div>
			<header><h3>{ data.display_name_prefixed }</h3></header>
			{/*<p>{ data.description }</p>
			<div>{ data.id }</div>
			<div>{ data.subscribers }</div>*/}
		</Link>
	);
}

export default SubRedditTab;