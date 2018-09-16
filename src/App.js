import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import config from "./config";
import getHashValue from "./helpers/getHashValue";

import Home from "./containers/Home";
import Sub from "./containers/Sub";
import Thread from "./containers/Thread";

import NavBar from "./components/NavBar";
import SubRedditTab from "./components/SubRedditTab";
import ControlTab from "./components/ControlTab";

class App extends Component {
  	constructor() {
		super();
		this.state = { subreddits: null, loggedIn: false }
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
  		if (token && state === config.SECRET_STRING) {
  			console.log("successfully logged in");
  			localStorage.setItem("access_token", token)
  			
  			// fetch subscribed subs
        fetchUser(token)
        .then(res => res.json())
        .then(data => this.setState({ user: data }))

  			fetchMySubs(token)
  			.then(res => res.json())
  			.then(data => this.setState({ subreddits: data.data.children, loggedIn: true }))
  		
  		} else {
  			const accessToken = localStorage.getItem("access_token");

  			if (accessToken) {
          fetchUser(accessToken)
          .then(res => res.json())
          .then(data => this.setState({ user: data }))

  				fetchMySubs(accessToken)
  				.then(res => res.json())
  				.then(data => this.setState({ subreddits: data.data.children, loggedIn: true }))
  			}
  		}
  	}
  	handleSubmit(e) {
  		e.preventDefault();
		console.log(e.target);
		fetch("https://www.reddit.com/")
		.then(res => res.json())
		.then(data => console.log(data))
		.catch(err => console.error(err))
  	}

  	render() {
		const { subreddits, loggedIn, user } = this.state;
    const sanitizedUser = user ? { name: user.name, karma: user.comment_karma, img: user.icon_img } : null;
		return (
			<Router>
		  	<div className="App">
				<NavBar loggedIn={ loggedIn } user={ sanitizedUser } />

				<SubRedditTab subreddits={ subreddits } />

				<ControlTab />

				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/r/:subreddit/:title" component={Thread} />
					<Route path="/r" component={Sub} />
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