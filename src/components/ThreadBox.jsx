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
				{ data.selftext && <p>{ data.selftext.slice(0, 140) }</p> }				

				{ data.media && data.media.reddit_video && <div className="media-wrapper"><iframe className="media" src={ data.media.reddit_video.scrubber_media_url } ></iframe></div> }
				{/* data.preview && data.preview.reddit_video_preview && <iframe src={ data.preview.reddit_video_preview.scrubber_media_url } ></iframe> */}
				{ data.media && "media" }
				{ data.media_embed.content && Parser(decodeHtml(data.media_embed.content)) }
				{ data.url && data.url.slice(0, 23) !== "https://www.reddit.com/" && <a href={ data.url } target="_blank" rel="noopener noreferrer"><div>{ data.url.split("/")[2] }</div></a> }


				<div className="commentsAndReplies_tb">
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