import React, { Component } from 'react';
import './css/Sub.css';

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";
import SortBox from "../components/SortBox";

class Sub extends Component {
  constructor() {
		super();
		this.state = { listing: null, currentSub: null, loading: true, sort: "Hot" };
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
  	const path = this.props.location.pathname;
  	const subreddit = path.split("/")[3];
  	
  	fetch(`https://www.reddit.com/r/${subreddit}/.json`)
  	.then(res => res.json())
  	.then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
  	.catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  }
  
  componentDidUpdate() {
  	const path = this.props.location.pathname;
  	const subreddit = path.split("/")[3];
    const { loading, currentSub, sort } = this.state;
  	if (!loading && currentSub !== subreddit) {
      if (!loading) { this.setState({ loading: true }); }
  		
      fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json`)
  		.then(res => res.json())
  		.then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
  		.catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  	}
  }
  
  handleSort(e) {
    this.setState({ loading: true, sort: e.target.value });
    
    const path = this.props.location.pathname;
    const subreddit = path.split("/")[3];
    
    fetch(`https://www.reddit.com/r/${subreddit}/${e.target.value}/.json`)
    .then(res => res.json())
    .then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
    .catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  }
  
  render() {
	const { listing, loading, sort } = this.state;
    
		if (loading) {
      return ( <LoadingScreen /> );

    } else if (listing) {
      const children = listing.data.children;

      return (
        <div className="Sub">

          <header className="SubTitle">
            <h2>r/{ children[0].data.subreddit }</h2>
          </header>

          <div className="container">
            <SortBox onChange={ this.handleSort } active={ sort } values={[ "Hot", "New", "Controversial", "Top" ]} />
            { children.map((c, i) => <ThreadBox { ...c } key={i} /> )}
          </div>
        </div>
      );
    
    } else {
      return ( <ErrorBox /> );
	  }
	}
}

export default Sub;

