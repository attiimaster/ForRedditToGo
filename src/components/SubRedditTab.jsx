import React from "react";
import { Link } from "react-router-dom";
import "./css/SubRedditTab.css";


const SubRedditTab  = ({ subreddits, isOpen }) => {
	console.log(isOpen)
	return (
		<div className={ isOpen ? "SubRedditTab SubRedditTab-active" : "SubRedditTab" }>
			<Link to="/x/"><div className="logo">For Reddit To Go</div></Link>	
			{ subreddits && subreddits.map((sub, i) => <SubRedditBox key={i} { ...sub } />)}
		</div>
	);
}

const SubRedditBox = props => {
	const { data } = props;
	const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "";

	return (
		<Link to={ `/x${uri}/r/${data.display_name}` } className="subreddit-box">
			<div className="subreddit-box-img" style={{ backgroundImage: `url(${data.header_img})` }}></div>
			<header><h3>{ data.display_name_prefixed }</h3></header>
			{/*<p>{ data.description }</p>
			<div>{ data.id }</div>
			<div>{ data.subscribers }</div>*/}
		</Link>
	);
}

export default SubRedditTab;