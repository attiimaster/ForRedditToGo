import React from "react";
import { Link } from "react-router-dom";
import "./css/ThreadBox.css";

import AuthorHeader from "../components/AuthorHeader";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

const ThreadBox = ({ data }) => {
	console.log(data)
	return (
		<Link to={ `${uri}/r/${data.subreddit}/${data.id}` } className="ThreadBox" >

			<small className="score">
				<span>{ data.score }</span>
			</small>
			
			<div className="content">
				<AuthorHeader r={ data.subreddit_name_prefixed } author={ data.author } date={ data.created_utc } />

				{ data && <h3>{ data.title }</h3> }
				{ data.selftext && <p>{ data.selftext.slice(0, 200) }</p> }				
				{ data.media && "Media" }
				{ data.media_embed.content && "Embedded Content" }
				{ data.url && data.url.slice(0, 23) !== "https://www.reddit.com/" && "Link" }


				<div style={{ marginTop: "4px" }}>
					<small>
						<span>{ `${data.num_comments} Comments` }</span>
					</small>
					<small className="score-mobile">
						<span>{ `${data.score} Upvotes` }</span>
					</small>
				</div>
			</div>

		</Link>
	);
}

export default ThreadBox;