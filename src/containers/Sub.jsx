import React, { Component } from 'react';
import './css/Sub.css';

import { fetchSubreddit, fetchWithToken, castVote } from "../services/user.service.js";

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";
import SortBox from "../components/SortBox";

class Sub extends Component {
  constructor() {
		super();
		this.state = { listing: null, currentSub: null, loading: true, sort: { value: "hot", top: "hour" } };
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
  	const subreddit = this.props.location.pathname.split("/")[3];
  	
  	fetchSubreddit(subreddit)
  	.then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
  	.catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  }
  
  componentDidUpdate() {
  	const subreddit = this.props.location.pathname.split("/")[3];
    const { loading, currentSub, sort } = this.state;
  	
    if (!loading && currentSub !== subreddit) {
      this.setState({ loading: true });

      fetchSubreddit(subreddit, sort)
  		.then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
  		.catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  	}
  }
  
  handleSort(e) {
    const sort = { value: e.target.form[0].value, top: e.target.form[1].value };
    const subreddit = this.props.location.pathname.split("/")[3];
    
    this.setState({ loading: true, sort });

    fetchSubreddit(subreddit, sort)
    .then(data => this.setState({ listing: data, currentSub: subreddit, loading: false }))
    .catch(err => this.setState({ listing: null, currentSub: subreddit, loading: false }))
  }

  handleVote(e) {
    const name = e.target.attributes.name.value;
    const dir = e.target.className === "fas fa-arrow-up" ? "1" : "-1";
    e.target.className += " orange";

    castVote(name, dir)
    .then(data => {
      console.log(data);
    })
    .catch(err => console.error(err)) 
  }
  
  render() {
	const { listing, loading, sort } = this.state;
    
		if (loading) {
      return ( <LoadingScreen /> );

    } else if (listing && listing.data) {
      const children = listing.data.children;

      return (
        <div className="Sub">

          <div className="container">

            <header className="SubTitle">
              <h2>r/{ children[0] && children[0].data.subreddit }</h2>
            </header>

            <SortBox onChange={ this.handleSort } active={ sort } values={[ "Hot", "New", "Controversial", "Top" ]} />
            { children.map((c, i) => <ThreadBox { ...c } handleVote={ this.handleVote } key={i} /> )}
          
          </div>
        </div>
      );
    
    } else {
      return ( <ErrorBox /> );
	  }
	}
}

export default Sub;

