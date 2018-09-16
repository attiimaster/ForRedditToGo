import React from "react";
import { Link } from "react-router-dom";
import config from "../config";
import "./css/NavBar.css";

const NavBar = props => {
	const { CLIENT_ID, REDIRECT_URI, DURATION, SCOPE, SECRET_STRING } = config;
	const { loggedIn, user } = props;

	return (
		<div className="navbar">
			
			<Link to="/" className="logo">For Reddit To Go</Link>		
			
			<div className="nav-right">
				<form>
					<input type="text" placeholder="search reddit" />
					<button type="submit"><i className="fas fa-search"></i></button>
				</form>
				{ loggedIn && user ?
					<UserBox user={ user } />
					:
					<a className="login-btn" href={ `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=token&state=${SECRET_STRING}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}` }>Log in to Reddit</a>
				}
			</div>

		</div>
	);
}

export default NavBar;

const UserBox = ({ user }) => {
	return (
		<div className="UserBox">
			<div className="name-karma-container">
				<div className="name">{ user.name }</div>
				<div className="karma">{ user.karma } Karma</div>
			</div>
			<img src={ user.img } />
		</div>
	);
}