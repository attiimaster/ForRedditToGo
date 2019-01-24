import React from "react";
import { Link } from "react-router-dom";
// import Parser from "html-react-parser";
import "./css/ThreadBox.css";

import AuthorHeader from "../components/AuthorHeader";
import ThreadStatsBox from "../components/ThreadStatsBox";
// import decodeHtml from "../helpers/decodeHtml";

const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

const ThreadBox = ({ data, handleVote }) => {
	return (
		<div className="ThreadBox" >

			<small className="score">
				<div>
					<div><i className="fas fa-arrow-up" name={ data.name } onClick={ handleVote }></i></div>
					<div>{ data.score }</div>
					<div><i className="fas fa-arrow-down" name={ data.name } onClick={ handleVote }></i></div>
				</div>
			</small>
			
			<div className="content">
				<AuthorHeader r={ data.subreddit_name_prefixed } author={ data.author } date={ data.created_utc } />

				<Link to={ `${uri}/r/${data.subreddit}/${data.id}` } >
					{ data && <h3>{ data.title }</h3> }
					{ data.selftext && <p className="selftext">{ data.selftext }</p> }				
	
					{/* data.media && data.media.reddit_video && <div className="media-wrapper"><iframe className="media" src={ data.media.reddit_video.scrubber_media_url } ></iframe></div> */}
					{/* data.preview && data.preview.reddit_video_preview && <iframe src={ data.preview.reddit_video_preview.scrubber_media_url } ></iframe> */}
					{/* data.media && "media" */}
					{/* data.media_embed.content && Parser(decodeHtml(data.media_embed.content)) */}
				</Link>

				<ThreadStatsBox 
					data={{ num_comments: data.num_comments,
							score: data.score,
							name: data.name,
							url: data.url
					}}
					handleVote={ handleVote }
				/>
			</div>

		</div>
	);
}

export default ThreadBox;