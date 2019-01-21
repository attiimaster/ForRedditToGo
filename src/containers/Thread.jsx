import React, { Component } from 'react';
import Parser from "html-react-parser";
import './css/Thread.css';

import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";
import AuthorHeader from "../components/AuthorHeader";
import Synth from "../components/Synth";
import SortBox from "../components/SortBox";
import MoreButton from "../components/MoreButton";

import { findIdInListing, findInListingAndInsert } from "../services/user.service.js";
import convertToHoursAgo from "../helpers/convertToHoursAgo";
import decodeHtml from "../helpers/decodeHtml";

class Thread extends Component {
  	constructor() {
		super();
		this.state = { listing: null, loading: true, toRead: null, sort: "Best" }
		this.handleSort = this.handleSort.bind(this);
		this.handleMore = this.handleMore.bind(this);
  	}
  	
  	componentDidMount() {
  		const path = this.props.location.pathname;
  		const subreddit = path.split("/")[3];
  		const id = path.split("/")[4];
  		
  		fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}/.json?limit=100`)
  		.then(res => res.json())
  		.then(data => this.setState({ listing: data, loading: false }))
  		.catch(err => {
  			this.setState({ listing: null, loading: false });
  			console.error(err);
  		})
  	}

  	handleSort(e) {
    	this.setState({ loading: true, sort: e.target.value });
    	
  		const path = this.props.location.pathname;
  		const subreddit = path.split("/")[3];
  		const id = path.split("/")[4];
  		
  		fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}/.json?sort=${e.target.value}&limit=100`)
  		.then(res => res.json())
  		.then(data => this.setState({ listing: data, loading: false }))
  		.catch(err => this.setState({ listing: err, loading: false }))
  	}

  	handleVote(e) {
  		const name = e.target.attributes.name.value;
  		const dir = e.target.className === "fas fa-arrow-up" ? "1" : "-1";
  		const token = localStorage.getItem("access_token");

  		fetch(`https://oauth.reddit.com/api/vote?id=${name}&dir=${dir}`, {
  			method: "POST",
  		  	headers: {
  		  	  Authorization: `bearer ${token}`
  		  	}
  		})
  		.catch(err => console.error(err))
  		.then(res => res.json())
  		.then(data => console.log(data))	

  		e.target.className += " orange"
  	}
  	handleMore(e, children, parentId) {
  		const { listing } = this.state;
  		const link_id = listing[0].data.children[0].data.id;
		
		const dummyListing = {
			data: {
				author: "ZharkoDK",
				body: "No reason to feel bad. I think you dodged a bullet there. ",
				id: "eegen2z",
				link_id: "t3_ahm7sd",
				name: "t1_eegen2z",
				parent_id: "t1_eeg9fa7",
				replies: { kind: "Listing", data: {} },
				subreddit: "AskReddit",
				subreddit_id: "t5_2qh1i",
			},
			kind: "t1"
		}

		const dummyMoreObj = {
			data: {
				children:[ "eegl116" ],
				count: 5,
				depth: 2,
				id: "eegl116",
				name: "t1_eegl116",
				parent_id: "t1_eegen2z"
			},
			kind: "more"
		}

		// console.log("link_id:", link_id)
		console.log("children:", children)
		console.log("parentId:", parentId)

  		// const link_id = link_id; // "t3_2otg5f";
  		// const children = children; // "cmqj5en";
  		// const id = dummyListing.data.name; // "t1_cmqj5en";

  		// fetch more replies
  		fetch(`https://www.reddit.com/api/morechildren.json?link_id=t3_${link_id}&children=${children.join(", ")}&api_type=json`)
  		.catch(err => console.error(err))
  		.then(res => res.json())
  		.then(data => {
  			console.log("add. replies:", data.json);

	  		// traverse listing to find matching id and append
  			// await findIdInListing(listing, parentId)
  			// or
  			// save nested location somehow for easy inserting
  			
  			findInListingAndInsert(listing, parentId.substring(3), data.json.data.things)
  			.then(newListing => this.setState({ listing: newListing }))
  		})
  		
  		// comments: listing[1].data.children.data
  		// replies: replies.data.children.data
  	}

  	render() {
		const { listing, loading, sort } = this.state;
		if (loading) {
			return ( <LoadingScreen /> );

	  	} else if (listing) {
			const threadInfo = listing[0].data.children[0];
			const comments = listing[1].data.children;

			return (
			  	<div className="Thread">
			  		<Synth listing={ listing } />
			  		<div className="container">
			  			<ThreadHead { ...threadInfo } handleVote={ this.handleVote } />
						<div>
							<SortBox onChange={ this.handleSort } active={ sort } values={[ "Best", "Top", "New", "Controversial",  "Old" ]} />
							{ comments && comments.map((c, i) => <CommentBox key={i} { ...c } handleVote={ this.handleVote } handleMore={ this.handleMore } />) }
						</div>
					</div>
			  	</div>
			);
		
		} else {
	  		return ( <ErrorBox /> );
	  	}
  	}
}

export default Thread;

const ThreadHead = ({ data, handleVote }) => {
	return (
		<article className="ThreadHead">
			<AuthorHeader r={ data.subreddit_name_prefixed } author={ data.author } date={ data.created_utc } />

			<header>
				<h2>{ data.title }</h2>
			</header>

			{/* data.media && data.media.reddit_video && <iframe src={ data.media.reddit_video.scrubber_media_url } width={ data.media.reddit_video.width } ></iframe> */}
			{/* data.preview && data.preview.reddit_video_preview && <iframe src={ data.preview.reddit_video_preview.scrubber_media_url } ></iframe> */}
			{/* data.media_embed.content && Parser(decodeHtml(data.media_embed.content)) */}
			{ data.selftext_html ? <div>{ Parser(decodeHtml(data.selftext_html)) }</div> : <p>{ "This post contains media only. Follow the link to find out more." }</p> }
			{ data.url && data.url.slice(0, 23) !== "https://www.reddit.com/" && <a href={ data.url } target="_blank" rel="noopener noreferrer"><div>{ data.url.split("/")[2] }</div></a> }

			<div className="stats">
				<small>{ data.num_comments } Comments</small>
				<small className="score">
					<span>
						<i className="fas fa-arrow-up" name={ data.name } onClick={ handleVote }></i>
						{ ` ${data.score} Upvotes ` }
						<i className="fas fa-arrow-down" name={ data.name } onClick={ handleVote }></i>
					</span>
				</small>
			</div>
		</article>
	);
}

const CommentBox = ({ data, handleVote, handleMore }) => {
	if (!data) { console.error("") }
	const hoursAgoStr = data && convertToHoursAgo(data.created_utc*1000);
	return (
		<div className="CommentBox">
			<div className="content">
				<small className="author">{ data.author } &#8226; { hoursAgoStr } </small>
				<div>{ Parser(decodeHtml(data.body_html)) }</div>

				<div className="stats">
					<small>
						<span>{ `${data.replies ? data.replies.data.children.length : 0} Replies` }</span>
					</small>
					<small className="score">
						<span>
							<i className="fas fa-arrow-up" name={ data.name } onClick={ handleVote }></i>
							{ ` ${data.score} Upvotes ` }
							<i className="fas fa-arrow-down" name={ data.name } onClick={ handleVote }></i>
						</span>
					</small>
				</div>
				<br />
				{/* loop over replies and check if reply === comment || link id to more*/}
				{
					data.replies && data.replies.data.children && data.replies.data.children.map((r, i) => r.kind === "more" ? 
						<MoreButton key={i} { ...r } onClick={ handleMore } text={ `${r.data.count} more replies` } />
						:
						r.data && <CommentBox { ...r } key={i} handleMore={ handleMore } />)
				}
			</div>
		</div>
	);
}

