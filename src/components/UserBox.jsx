import React from "react";
import "./css/UserBox.css";
// import history from "../helpers/history";

const UserBox = ({ loggedIn, user, logout }) => {
	return (
		<div className="login-user-field">
		{
			loggedIn && user ? <ActualUserBox user={ user } logout={ logout } /> : <LoginButton />
		}
		</div>
	);
}

export default UserBox;

const ActualUserBox = ({ user, logout }) => {
	return (
		<div className="UserBox">
			<div className="name-karma-container">
				<div className="name">{ user.name }</div>
				<div className="karma">{ user.karma } Karma</div>
			</div>
			<img src={ user.img } alt="user_image" />
			<button onClick={ logout } className="logout-btn">Logout</button>
		</div>
	);
}

const LoginButton = () => {
	const { REACT_APP_DURATION, REACT_APP_SCOPE, REACT_APP_SECRET_STRING } = process.env;
	const CLIENT_ID = process.env.NODE_ENV === "production" ? process.env.REACT_APP_CLIENT_ID : process.env.REACT_APP_CLIENT_ID_DEV;
	const URI = process.env.NODE_ENV === "production" ? process.env.REACT_APP_URI : process.env.REACT_APP_URI_DEV;
	return (
		<a className="login-btn"
			href={ `https://www.reddit.com/api/v1/authorize
			?client_id=${CLIENT_ID}
			&response_type=token
			&state=${REACT_APP_SECRET_STRING}
			&redirect_uri=${URI}
			&duration=${REACT_APP_DURATION}
			&scope=${REACT_APP_SCOPE}` }>
		    <i className="fas fa-user"></i>
		</a>
	);
}