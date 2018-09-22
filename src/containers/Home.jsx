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
              <h1>Skip & { decodeHtml(encoded) } Update</h1>
              <br />
              <br />
              { encoded && decodeHtml(encoded) }
              { encoded && Parser(decodeHtml(encoded)) }
              <div  />
          </header>
  
	    	</div>
	  );
  }
}

export default Home;