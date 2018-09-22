import React from "react";
import { Link } from "react-router-dom";
import "./css/SubRedditTab.css";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

const SubRedditTab  = ({ subreddits, isOpen, handleSideBar, loggedIn }) => {
	return (
		<div className={ isOpen ? "SubRedditTab SubRedditTab-active" : "SubRedditTab" }>
			<div className="sub-reddit-tab-top">
				<Link className="logo" to={ `${uri}/` } onClick={ handleSideBar }>For Reddit To Go</Link>
				<i className="fas fa-times" onClick={ handleSideBar }></i>
			</div>	
			{ subreddits && subreddits.map((sub, i) => <SubRedditBox handleSideBar={ handleSideBar } key={i} { ...sub } />)}
			{ !subreddits && <div className="not-logged-in">Log in to see a list of your subscribed subreddits.</div> }
		</div>
	);
}

export default SubRedditTab;


const SubRedditBox = ({ data, handleSideBar }) => {

	return (
		<Link to={ `${uri}/r/${data.display_name}` } onClick={ handleSideBar } className="subreddit-box">
			<div className="subreddit-box-img" style={{ backgroundImage: `url(${data.header_img})` }}></div>
			<h3>{ data.display_name_prefixed }</h3>
		</Link>
	);
}