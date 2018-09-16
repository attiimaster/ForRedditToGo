import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './css/Home.css';

import readOutLoud from "../helpers/readOutLoud";

class Home extends Component {
  	constructor(props) {
		super(props);
		this.state = {}
  	}
  	componentDidMount() {
      // readOutLoud("For Reddit, to GO");
    }

  	render() {
		return (
		  	<div className="Home">

          <header className="home-header">
              <h1>For Reddit, To Go</h1>
              Listen to Reddit
          </header>

		  	</div>
		);
  	}
}

export default Home;