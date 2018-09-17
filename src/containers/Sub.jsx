import React, { Component } from 'react';
import './css/Sub.css';

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";

class Sub extends Component {
  	constructor() {
		super();
		this.state = { listing: null, currentSub: null, loading: true };
  	}
  	componentDidMount() {
  		const path = this.props.location.pathname;
      console.log(path)
  		const subreddit = path.split("/")[3];
      console.log(subreddit)
  		
  		fetch(`https://www.reddit.com/r/${subreddit}/.json`)
  		.then(res => res.json())
  		.then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
  		.catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  	}
  	componentDidUpdate() {
  		const path = this.props.location.pathname;
  		const subreddit = path.split("/")[3];

  		if (this.state.currentSub !== subreddit) {
        if (!this.state.loading) { this.setState({ loading: true }); }
  			
        fetch(`https://www.reddit.com/r/${subreddit}/.json`)
  			.then(res => res.json())
  			.then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
  			.catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  		}
  	}

  	render() {
		const { listing, loading } = this.state;
    
		if (loading) {
      return ( <LoadingScreen /> );

    } else if (listing) {
      const children = listing.data.children;

      return (
          <div className="Sub">
            <div className="SubTitle">
              <h2>r/{ children[0].data.subreddit }</h2>
            </div>
            { children.map((c, i) => <ThreadBox { ...c } key={i} /> )}
          </div>
      );
    
    } else {
      return ( <ErrorBox /> );
	  }
	}
}

export default Sub;

