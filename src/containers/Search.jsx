import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/Search.css";

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import LoadingScreen from "../components/LoadingScreen";

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
  			
  			const posts = await fetch(`https://www.reddit.com/search.json?q=${newQuery}`);
    		const subreddits = await fetch(`https://www.reddit.com/subreddits/search.json?q=${newQuery}`);
	
    		this.setState({
				posts: await posts.json(), 
    			subreddits: await subreddits.json(), 
    			loading: false, 
    			query: newQuery
    		})	
		}
	}
	render() {
		const { posts, subreddits, loading, query } = this.state;

		if (loading) {
    	  	return ( <LoadingScreen /> );
	
    	} else if (posts && subreddits || subreddits || posts) {
			return (
				<div className="Search">
	
					<header className="SearchTitle">
						<h2>Search results for <u>{ query }</u>:</h2>
					</header>
	
					<section>
						{ subreddits && subreddits.data.children.map((c, i) => <SubRedditBoxAlt { ...c } />) }
					</section>
					<div style={{ width: "80%", margin: "20px auto", borderTop: "1px solid #555" }}></div>
					<section>
						{ posts && posts.data.children.map((c, i) => <ThreadBox { ...c } />) }
					</section>
	
				</div>
			);

		} else {
			return (<ErrorBox />);
		}
	}
}

export default Search;

const SubRedditBoxAlt = ({ data }) => {
	return (
		<Link to={ `${uri}/r/${data.display_name}` } >
		<div className="SubRedditBoxAlt">
			<div className="subreddit-box-img" style={{ backgroundImage: `url(${data.header_img})` }}></div>
			
			<div className="title">
				<p><b>{ data.display_name_prefixed }</b></p>
				<small>{ data.subscribers } Subscribers</small>
			</div>

			<small className="description">{ data.public_description || data.title }</small>
		</div>
		</Link>
	);
}