import React from "react";
import { Link } from "react-router-dom";
import Parser from "html-react-parser";
import "./css/ThreadBox.css";

import AuthorHeader from "../components/AuthorHeader";
import decodeHtml from "../helpers/decodeHtml";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

const ThreadBox = ({ data }) => {
	return (
		<Link to={ `${uri}/r/${data.subreddit}/${data.id}` } className="ThreadBox" >

			<small className="score">
				<span>{ data.score }</span>
			</small>
			
			<div className="content">
				<AuthorHeader r={ data.subreddit_name_prefixed } author={ data.author } date={ data.created_utc } />

				{ data && <h3>{ data.title }</h3> }
				{ data.selftext ? <p className="selftext">{ data.selftext }</p> : <p>{ "This post contains media only. Follow the link to find out more." }</p> }				

				{/* data.media && data.media.reddit_video && <div className="media-wrapper"><iframe className="media" src={ data.media.reddit_video.scrubber_media_url } ></iframe></div> */}
				{/* data.preview && data.preview.reddit_video_preview && <iframe src={ data.preview.reddit_video_preview.scrubber_media_url } ></iframe> */}
				{/* data.media && "media" */}
				{/* data.media_embed.content && Parser(decodeHtml(data.media_embed.content)) */}
				{ data.url && data.url.slice(0, 23) !== "https://www.reddit.com/" && <a href={ data.url } target="_blank" rel="noopener noreferrer"><div>{ data.url.split("/")[2] }</div></a> }

				<div className="stats">
					<small>
						<span>{ `${data.num_comments} Comments` }</span>
					</small>
					<small className="score-mobile">
						<span>
							<i className="fas fa-arrow-up"></i>
							{ ` ${data.score} Upvotes ` }
							<i className="fas fa-arrow-down"></i>
						</span>
					</small>
				</div>
			</div>

		</Link>
	);
}

export default ThreadBox;