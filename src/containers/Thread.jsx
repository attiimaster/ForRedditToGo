import React, { Component } from 'react';
import './css/Thread.css';

import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";
import AuthorHeader from "../components/AuthorHeader";
import Synth from "../components/Synth";

import readOutLoud from "../helpers/readOutLoud";

class Thread extends Component {
  	constructor() {
		super();
		this.state = { listing: null, loading: true, toRead: null }
		this.HandleClick = this.HandleClick.bind(this);
  	}
  	componentDidMount() {
  		const path = window.location.pathname;
  		
  		const subreddit = path.split("/")[3];
  		const id = path.split("/")[4];
  		
  		fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}/.json`)
  		.then(res => res.json())
  		.then(data => this.setState({ listing: data, loading: false }))
  		.catch(err => this.setState({ listing: "ERROR", loading: false }))
  	}
  	HandleClick(e) {
  		readOutLoud(toRead(this.state.listing));
  	}

  	render() {
		const { listing, loading } = this.state;

		if (listing) {
			const threadInfo = listing[0].data.children[0];
			const comments = listing[1].data.children;


			return (
			  	<div className="Thread">
			  		<Synth toRead={ toRead(listing) } />
			  		<ThreadTitle { ...threadInfo } onClick={ this.HandleClick } />
			  		<ThreadCommentsContainer comments={ comments } />
			  	</div>
			);
		
		} else if (loading) {
			return ( <LoadingScreen /> );

	  	} else {
	  		return ( <ErrorBox /> );
	  	}
  	}
}

export default Thread;

const ThreadTitle = props => {
	const { data, onClick } = props;

	return (
		<article className="ThreadTitle">
			<AuthorHeader r={ data.subreddit_name_prefixed } author={ data.author } date={ data.created_utc } />

			<header>
				<h2>{ data.title }</h2>
			</header>

			<p>{ data.selftext }</p>

			<small>
				<span  className="subreddit">{ data.num_comments } Comments</span>
				<span  className="subreddit"> - { data.score } Upvotes</span>
			</small>
		</article>
	);
}
const ThreadCommentsContainer = props => {
	const { comments } = props; 
	return (
		<div>
			{ comments.map((c, i) => <CommentBox key={i} { ...c } />) }
		</div>
	);
}
const CommentBox = props => {
	const { data } = props;
	const date = new Date(data.created_utc*1000).toString()
	return (
		<div className="CommentBox">
			<small className="score">
				<span>{ data.score }</span>
			</small>
			<div className="content">
				<div className="author"><b>{ data.author }</b> &#8226; { date.slice(4, 21) } </div>
				<p>{ data.body }</p>
			</div>
		</div>
	);
}

const toRead = listing => {
	const title =  listing[0].data.children[0].data.title;
	const post = listing[0].data.children[0].data.selftext;
	const comments = listing[1].data.children;

	// push title, post and comments to array in order and read out
	let toRead = [];
	toRead.push(title);
	toRead.push(post);
	comments.map((c, i) => toRead.push(c.data.body));

	return toRead;
}