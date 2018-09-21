import React, { Component } from 'react';
import './css/Home.css';


class Home extends Component {
  	constructor(props) {
		super(props);
		this.state = {}
  	}
  	componentDidMount() {}

  	render() {
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
              <h1>synth fixx update</h1>
              <br />
              <br />
          </header>

		  	</div>
		);
  	}
}

export default Home;