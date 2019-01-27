import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/Search.css";

import { searchReddit, fetchReddit } from "../services/user.service.js";
import spaceOutNumber from "../helpers/spaceOutNumber";

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";
import MoreButton from "../components/MoreButton";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class Search extends Component {
	constructor() {
		super();
		this.state = { loading: true, query: null, posts: null, subreddits: null }
		this.getMoreSubreddits = this.getMoreSubreddits.bind(this);
	}

	async componentDidMount() {   
		const query = this.props.location.pathname.split("/")[3];

		const { subreddits, posts } = await searchReddit(query);

    	this.setState({
			posts, 
    		subreddits, 
    		loading: false, 
    		query
    	})
	}

	async componentDidUpdate() {
		const { query, loading } = this.state;
  		const newQuery = this.props.location.pathname.split("/")[3];

  		if (!loading && query !== newQuery) {
        	this.setState({ loading: true });

        	const { subreddits, posts } = await searchReddit(newQuery);
	
    		this.setState({
    			subreddits,
				posts,  
    			loading: false, 
    			query: newQuery
    		})	
		}
	}

	async getMoreSubreddits() {
		const { query } = this.state;
		const subreddits = await fetchReddit(`/subreddits/search.json?q=${query}&limit=25`);
    	this.setState({ subreddits });
	}

	render() {
		const { posts, subreddits, loading, query } = this.state;

		if (loading) {
    	  	return ( <LoadingScreen /> );
	
    	} else if ((posts && subreddits) || subreddits || posts) {
			return (
				<div className="Search">
	
					<div className="container">
						<header className="SearchTitle">
							<h2>Search results for <u>{ query }</u>:</h2>
						</header>
						
						<section className="search-results">
							<h3>Subreddits</h3>
							{ subreddits.data.children[0] ? subreddits.data.children.map((c, i) => <SubRedditBoxAlt { ...c } key={i} />) : <small>Wow, much empty o.O</small> }
							<MoreButton onClick={ this.getMoreSubreddits } text="Show more results" />
						</section>
						
						<div style={{ width: "100%", margin: "40px auto" }}></div>
						
						<section className="search-results">
							<h3>Posts</h3>
							{ posts.data.children[0] ? posts.data.children.map((c, i) => <ThreadBox { ...c } key={i} />) : <small>Wow, much empty o.O</small> }
						</section>
					</div>
				</div>
			);

// if status code || ganz weg
		} else {
			return (<ErrorBox />);
		}
	}
}

export default Search;

const SubRedditBoxAlt = ({ data }) => {
	console.log(data)
	return (
		<Link to={ `${uri}/r/${data.display_name}` } >
		<div className="SubRedditBoxAlt">
			<div className="head">
				<div className="subreddit-box-img" style={{ backgroundImage: `url(${data.community_icon || data.icon_img})` }}></div>
				
				<div className="title">
					<p><b>{ data.display_name_prefixed }</b></p>
					<small>{ spaceOutNumber(data.subscribers) } Subscribers</small>
				</div>
			</div>
			<small className="description">{ data.public_description || data.title }</small>
		</div>
		</Link>
	);
}