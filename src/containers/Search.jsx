import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/Search.css";

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";
import MoreButton from "../components/MoreButton";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class Search extends Component {
	constructor() {
		super();
		this.state = { loading: true, query: null, posts: null, subreddits: null }
	}
	async componentDidMount() {   
		const query = this.props.location.pathname.split("/")[3];
		console.log(query);

    	const posts = await fetch(`https://www.reddit.com/search.json?q=${query}`);
    	const subreddits = await fetch(`https://www.reddit.com/subreddits/search.json?q=${query}`);

    	this.setState({
			posts: await posts.json(), 
    		subreddits: await subreddits.json(), 
    		loading: false, 
    		query: query
    	})
	}
	async componentDidUpdate() {
		const { query, loading } = this.state;
  		const newQuery = this.props.location.pathname.split("/")[3];

  		if (!loading && query !== newQuery) {
        	if (!loading) { this.setState({ loading: true }); }
  			
    		const subreddits = await fetch(`https://www.reddit.com/subreddits/search.json?q=${newQuery}`);
  			const posts = await fetch(`https://www.reddit.com/search.json?q=${newQuery}`);
	
    		this.setState({
    			subreddits: await subreddits.json(),
				posts: await posts.json(),  
    			loading: false, 
    			query: newQuery
    		})	
		}
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
							{ subreddits.data.children[0] ? subreddits.data.children.slice(0, 5).map((c, i) => <SubRedditBoxAlt { ...c } key={i} />) : <small>Wow, much empty o.O</small> }
							<MoreButton onClick={ () => "" } text="Show more results" />
						</section>
						
						<div style={{ width: "100%", margin: "20px auto", borderTop: "1px solid silver" }}></div>
						
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
					<small>{ data.subscribers } Subscribers</small>
				</div>
			</div>
			<small className="description">{ data.public_description || data.title }</small>
		</div>
		</Link>
	);
}