import React from "react";
import { Link } from "react-router-dom";
import "./css/ThreadBox.css";

import AuthorHeader from "../components/AuthorHeader";

const ThreadBox = props => {
	const { data } = props;	// console.log(decodeHTML(data.media_embed.content))
	const uri = process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "";
	// console.log(data);
	return (
		<Link to={ window.location.pathname + `/${data.id}` } className="ThreadBox" >


			<small className="score">
				<span>{ data.score }</span>
			</small>
			<div className="content">
				<h3>{ data ? data.title : null }</h3>
				
				<AuthorHeader r={ data.subreddit_name_prefixed } author={ data.author } date={ data.created_utc } />

				<br/>
				<small>
					<span>{ data.num_comments } Comments</span>
				</small>
			</div>

			
<div className="xyz">
{ data.selftext ? <p>data.selftext</p> : null }	
{ data.url ? <p>data.url</p> : null }					{/*  data.url */}
{ data.media ? <p>data.media</p> : null }				{/* data.media.toString() */}
{ data.media_embed ? <p>data.media_embed</p> : null }	{/* decodeHTML(data.media_embed.content) */}
{ data.preview ? <p>data.preview</p> : null }			{/* data.preview */}
</div>

		</Link>
	);
}

export default ThreadBox;

// const decodeHTML = html => {
// 	const txt = document.createElement("textarea");
// 	txt.innerHTML = html;
// 	return txt.value;
// }