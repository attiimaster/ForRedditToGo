import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from "./helpers/history";
import './App.css';

// import config from "./config";
import { tryLogin, logout } from "./services/auth.service.js";

import About from "./containers/About";
import Sub from "./containers/Sub";
import Thread from "./containers/Thread";
import Search from "./containers/Search";
import Frontpage from "./containers/Frontpage";

import NavBar from "./components/NavBar";
import SubRedditTab from "./components/SubRedditTab";
      
const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class App extends Component {
  	constructor() {
		super();
		this.state = { user: null, mySubreddits: null, loggedIn: false, sidebarIsOpen: false }
    this.handleSideBar = this.handleSideBar.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.logout = this.logout.bind(this);
  	}

  	componentDidMount() {
      tryLogin()
        .then(data => {
          this.setState({
            user: data[0],
            mySubreddits: data[1].data.children,
            loggedIn: true 
          });
          history.push(`${uri}/frontpage`);
        })
        .catch(err => {
          console.error(err);
        })
  	}

    handleSideBar(e) {
        this.setState({ sidebarIsOpen: !this.state.sidebarIsOpen });
    }

  	handleSearch(e) {
      e.preventDefault();
      const query = e.target[0].value;
      history.push(`${uri}/search/${query}`);
    }

    logout(e) {
      logout();
      this.setState({ user: null, mySubreddits: null, loggedIn: false });
    }

  	render() {
		  const { mySubreddits, loggedIn, user, sidebarIsOpen } = this.state;
      const sanitizedUser = user ? { name: user.name, karma: user.comment_karma, img: user.icon_img } : null;
  
      return (
		  	<Router history={ history }>
		    	
          <div className="App">
		  		  <NavBar loggedIn={ loggedIn } user={ sanitizedUser } handleSideBar={ this.handleSideBar } onSubmit={ this.handleSearch } logout={ this.logout } />
    
		  		  <SubRedditTab subreddits={ mySubreddits } isOpen={ sidebarIsOpen } handleSideBar={ this.handleSideBar } />
    
		  		  <Switch>
		  		  	<Route exact path={ `${uri}/frontpage` } render={ props => <Frontpage mySubreddits={ mySubreddits } loggedIn={ loggedIn } { ...props } /> } />
		  		  	<Route path={ `${uri}/r/:subreddit/:title` } component={Thread} />
              <Route path={ `${uri}/r` } component={Sub} />
              <Route path={ `${uri}/search/:query` } component={Search} />
              <Route path={ `${uri}/loginsuccess` } component={LoginSuccess} />
              <Route path={ `${uri}/` } component={About} />
              <Route path={ `${uri}/about` } component={About} />
		  		  </Switch>	
		    	</div>
          
		    </Router>
		  );
  	}
}

export default App;

const LoginSuccess = () => {
  // works, because app remounts on login redirect
  // and tryLogin() in compDidMount() fires again
  setTimeout(() => history.push(uri), 100);
  return (
    <div>
      <h2>Login Success!</h2>
      <p>You will be redirected shortly.</p>
    </div>
  );
}