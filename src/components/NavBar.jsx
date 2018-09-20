import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/NavBar.css";

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = { isHidden: false };    
		this.onScroll = () => {
      		const { isHidden } = this.state;
			console.log("onsc")      
			console.log("w.s", window.scrollY)      
			console.log("t.p", this.prev)      
  		    if (window.scrollY > this.prev) {
				this.setState({ isHidden: true });
  		    } else {
  		        this.setState({ isHidden: false });
  		    }
  		    this.prev = window.scrollY;
  		}
  	}
  	componentDidMount() {
  	  window.addEventListener("scroll", this.onScroll);
  	}
  	componentWillUnmount() {
  	  window.removeEventListener("scroll", this.onScroll);
  	}

  	render() {
		const { REACT_APP_DURATION, REACT_APP_SCOPE, REACT_APP_SECRET_STRING } = process.env;
		const CLIENT_ID = process.env.NODE_ENV === "production" ? process.env.REACT_APP_CLIENT_ID : process.env.REACT_APP_CLIENT_ID_DEV;
		const URI = process.env.NODE_ENV === "production" ? process.env.REACT_APP_URI : process.env.REACT_APP_URI_DEV;
		const { loggedIn, user, handleSideBar, onSubmit } = this.props;
		const { isHidden } = this.state;
	
		return (
			<nav  className={ isHidden ? "navbar hide" : "navbar" } >
				
				<i onClick={ handleSideBar } className="fas fa-bars"></i>
				
				<Link to="/x/" className="link"><div className="logo">For Reddit To Go</div></Link>	
	
				<form onSubmit={ onSubmit } >
					<input type="text" placeholder="search reddit" />
					<button type="submit"><i className="fas fa-search"></i></button>
				</form>
	
				<div className="login-user-field">
				{ loggedIn && user ?
					<UserBox user={ user } />
					:
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
				}
				</div>
	
			</nav>
		);
	}
}

export default NavBar;

const UserBox = ({ user }) => {
	return (
		<div className="UserBox">
			<div className="name-karma-container">
				<div className="name">{ user.name }</div>
				<div className="karma">{ user.karma } Karma</div>
			</div>
			<img src={ user.img } alt="user_image" />
		</div>
	);
}