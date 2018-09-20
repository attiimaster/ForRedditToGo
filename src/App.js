import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from "./helpers/history";
import './App.css';

// import config from "./config";
import getHashValue from "./helpers/getHashValue";

import Home from "./containers/Home";
import Sub from "./containers/Sub";
import Thread from "./containers/Thread";
import Search from "./containers/Search";

import NavBar from "./components/NavBar";
import SubRedditTab from "./components/SubRedditTab";
      
const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class App extends Component {
  	constructor() {
		super();
		this.state = { user: null, mySubreddits: null, loggedIn: false, sidebarIsOpen: false }
    this.handleSideBar = this.handleSideBar.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  	}

  	componentDidMount() {
      const accessToken = localStorage.getItem("access_token");

  		// check and parse url | values: access_token, token_type, state, expires_in, scope
  		const token = getHashValue("access_token");
  		const state = getHashValue("state");
  
  		// validate request and origin
  		if (token && state === process.env.REACT_APP_SECRET_STRING) {
  			console.log("successfully logged in");
  			localStorage.setItem("access_token", token);
  			
  			// fetch user info
        fetchUser(token)
        .then(res => res.json())
        .then(data => this.setState({ user: data }))
        .catch(err => console.error(err))
  
  			fetchMySubs(token)
  			.then(res => res.json())
  			.then(data => this.setState({ mySubreddits: data.data.children, loggedIn: true }))
        .catch(err => console.error(err))
  		}

      // if no params in url check localStorage
      if (accessToken) {

        // fetch user info
        fetchUser(accessToken)
        .then(res => res.json())
        .then(data => this.setState({ user: data }))
        .catch(err => console.error(err))

        fetchMySubs(accessToken)
        .then(res => res.json())
        .then(data => this.setState({ mySubreddits: data.data.children, loggedIn: true }))
        .catch(err => console.error(err))
      }
  	}

    handleSideBar(e) {
      console.log("handleSideBar");
      this.state.sidebarIsOpen ? 
        this.setState({ sidebarIsOpen: false })
        :
        this.setState({ sidebarIsOpen: true });
    }

  	handleSearch(e) {
      e.preventDefault();
      const query = e.target[0].value;
      history.push(`${uri}/search/${query}`)
    }

  	render() {
		  const { mySubreddits, loggedIn, user, sidebarIsOpen } = this.state;
      const sanitizedUser = user ? { name: user.name, karma: user.comment_karma, img: user.icon_img } : null;
  
      return (
		  	<Router history={ history }>
		    	<div className="App">
		  		<NavBar loggedIn={ loggedIn } user={ sanitizedUser } handleSideBar={ this.handleSideBar } onSubmit={ this.handleSearch } />
  
		  		<SubRedditTab subreddits={ mySubreddits } isOpen={ sidebarIsOpen } handleSideBar={ this.handleSideBar } />
  
		  		<Switch>
		  			<Route exact path={ `${uri}/` } component={Home} />
		  			<Route path={ `${uri}/r/:subreddit/:title` } component={Thread} />
            <Route path={ `${uri}/r` } component={Sub} />
            <Route path={ `${uri}/search/:query` } component={Search} />
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