import React, { Component } from 'react';
import Parser from "html-react-parser";
import './css/Home.css';

import decodeHtml from "../helpers/decodeHtml";


class Home extends Component {
  constructor(props) {
	super(props);
	this.state = { encoded: "&lt;h1&gt;Parse&lt;/h1&gt;" };
  }
  componentDidMount() {}

  render() {
    const { encoded } = this.state;
	  return (
	    	<div className="Home">
  
          <header className="home-header">
              <br />
              <br />
              <h1>For Reddit, To Go</h1>
              <br />
              <br />
              <h3>Listen to Reddit while doing stuff.</h3>
              <br />
              <br />
              <h1><i className="fas fa-forward"></i> & <i className="fas fa-backward"></i> Update</h1>
              <br />
              <br />
              <div  />
          </header>
  
	    	</div>
	  );
  }
}

export default Home;