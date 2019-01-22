import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/NavBar.css";

import UserBox from "./UserBox";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = { isHidden: false };    
		this.onScroll = () => {  
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
		const { loggedIn, user, handleSideBar, onSubmit, logout } = this.props;
		const { isHidden } = this.state;
	
		return (
			<nav  className={ isHidden ? "navbar hide" : "navbar" } >
				
				<i onClick={ handleSideBar } className="fas fa-bars"></i>
				
				<Link to={`${uri}/`} className="link"><div className="logo">For Reddit To Go</div></Link>	
	
				<form onSubmit={ onSubmit } >
					<input type="text" placeholder="search reddit" />
					<button type="submit"><i className="fas fa-search"></i></button>
				</form>
	
				<UserBox loggedIn={ loggedIn } user={ user } logout={ logout } />
	
			</nav>
		);
	}
}

export default NavBar;