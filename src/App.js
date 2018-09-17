import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

// import config from "./config";
import getHashValue from "./helpers/getHashValue";

import Home from "./containers/Home";
import Sub from "./containers/Sub";
import Thread from "./containers/Thread";

import NavBar from "./components/NavBar";
import SubRedditTab from "./components/SubRedditTab";

class App extends Component {
  	constructor() {
		super();
		this.state = { subreddits: null, loggedIn: false, sidebarIsOpen: false }
    this.handleSideBar = this.handleSideBar.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  	}
  	componentDidMount() {
  		// if (accessToken)

  		// parse url
		//access_token, token_type, state, expires_in, scope
  		const token = getHashValue("access_token");
  		const state = getHashValue("state");

  		// validate request and origin
  		// if error
  		if (token && state === process.env.REACT_APP_SECRET_STRING) {
  			console.log("successfully logged in");
  			localStorage.setItem("access_token", token)
  			
  			// fetch subscribed subs
        fetchUser(token)
        .then(res => res.json())
        .then(data => this.setState({ user: data }))
        .catch(err => console.error(err))

  			fetchMySubs(token)
  			.then(res => res.json())
  			.then(data => this.setState({ subreddits: data.data.children, loggedIn: true }))
        .catch(err => console.error(err))
  		
  		} else {
  			const accessToken = localStorage.getItem("access_token");

  			if (accessToken) {
          fetchUser(accessToken)
          .then(res => res.json())
          .then(data => this.setState({ user: data }))
          .catch(err => console.error(err))

  				fetchMySubs(accessToken)
  				.then(res => res.json())
  				.then(data => this.setState({ subreddits: data.data.children, loggedIn: true }))
          .catch(err => console.error(err))
  			}
  		}
  	}
    handleSideBar(e) {
      this.state.sidebarIsOpen ? 
        this.setState({ sidebarIsOpen: false })
        :
        this.setState({ sidebarIsOpen: true });
    }
  	handleSubmit(e) {
      e.preventDefault();
      fetch("https://www.reddit.com/")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err))
    }

  	render() {
		const { subreddits, loggedIn, user, sidebarIsOpen } = this.state;
    const sanitizedUser = user ? { name: user.name, karma: user.comment_karma, img: user.icon_img } : null;
		const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

    return (
			<Router>
		  	<div className="App">
				<NavBar loggedIn={ loggedIn } user={ sanitizedUser } handleSideBar={ this.handleSideBar } />

				<SubRedditTab subreddits={ subreddits } isOpen={ sidebarIsOpen } />

				<Switch>
					<Route exact path={ `${uri}/` } component={Home} />
					<Route path={ `${uri}/r/:subreddit/:title` } component={Thread} />
					<Route path={ `${uri}/r` } component={Sub} />
				</Switch>	

		  	</div>
		  	</Router>
		);
  	}
}

export default App;

// /subreddits/mine/subscriber

const fetchUser = (token) => {
  const options = {
    headers: {
      Authorization: `bearer ${token}`
    }
  }
  return fetch(`https://oauth.reddit.com/api/v1/me`, options)
}

const fetchMySubs = (token) => {
  const options = {
    headers: {
      Authorization: `bearer ${token}`
    }
  }
  return fetch(`https://oauth.reddit.com/subreddits/mine/subscriber`, options)
}