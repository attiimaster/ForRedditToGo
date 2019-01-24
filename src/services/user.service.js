import accesstoken from "../helpers/accesstoken";
import tokenIsValid from "../helpers/tokenIsValid";

export default {
	fetchFrontpage,
	fetchSubreddit,
	fetchRedditThread,
	fetchUserData,
	fetchWithToken,
	postWithToken,
	fetchMoreAndInsert,
}

// search

// vote
export function castVote(id, dir) {
	// dir === 1 || -1 and indicates upvote || downvote

	return postWithToken(`/api/vote?id=${id}&dir=${dir}`)
}
// sort
function determineSorting(params) {
	// also submits parameters like limit oder .json, schlechter name
	const generalParam = params ? params.value : "";
    const topOfAllParam = generalParam === "top" ? `&t=${params.top}` : "";

    return `/${generalParam}.json?limit=100${topOfAllParam}`;
}

// 
function getRecommendedSubreddits() {
	return ["askreddit", "showerthoughts"];
}


// =========== api ============

export function fetchFrontpage(mySubreddits, sortParams) {
    // if user has no subreddits or is not logged in, populate frontpage with predetermined subreddits
    mySubreddits = mySubreddits ?
    	mySubreddits.map(sub => sub.data.display_name)
    	:
    	getRecommendedSubreddits();

    return fetchReddit(`/r/${mySubreddits.join("+")}${determineSorting(sortParams)}`)
}

export function fetchSubreddit(subreddit, sortParams) {
  	return fetchReddit(`/r/${subreddit}${determineSorting(sortParams)}`);
}

export function fetchRedditThread(subreddit, id, sortParams) {
  	return fetchReddit(`/r/${subreddit}/comments/${id}/.json?sort=${sortParams}&limit=100`);
}

export function fetchUserData(token) {
  	return Promise.all([
  		// fetch users reddit profile
		fetchWithToken("/api/v1/me", token),
  		// fetch list of users subscribed subreddits
		fetchWithToken("/subreddits/mine/subscriber", token)
	]);
}


// ========== general purpose ============

async function fetchReddit(path) {
  	const res = await fetch(`https://www.reddit.com${path}`);
  	console.log(res.status);
  	return res.json();
}

export async function fetchWithToken(path, token) {
	token = token || accesstoken.get();

	if (!tokenIsValid(token)) {
		accesstoken.remove();
		return Promise.reject("Token is expired.");
	}

	const options = {
	  headers: {
	    Authorization: `bearer ${token.value}`
	  }
	}

	const res = await fetch(`https://oauth.reddit.com${path}`, options);
  	console.log(res.status);
	return res.json();
}

export async function postWithToken(path) {
// only function that returns res instead of res.json(),
// because it is used exclusively by castVote(), which returns a parsed object
	const token = accesstoken.get();

	if (!tokenIsValid(token)) {
		accesstoken.remove();
		return Promise.reject("Token is expired.");
	}

	const options = {
		method: "POST",
	  	headers: {
	    	Authorization: `bearer ${token.value}`
	  	}
	}

	const res = await fetch(`https://oauth.reddit.com${path}`, options);
	console.log(res.status);
	return res;
}


// =========== more button functionality ============

export async function fetchMoreAndInsert(link_id, children, listing, parentId) {
  	
  	// fetch more replies
  	const res = await fetchReddit(`/api/morechildren.json?link_id=t3_${link_id}&children=${children.join(", ")}&api_type=json`)

  	// traverse listing to find matching id and append replies ( is currently mutating :S )
  	return findInListingAndInsert(listing, parentId.substring(3), res.json.data.things);
}

// takes listing and additional replies and merges them
function findInListingAndInsert(listing, parentId, ArraytoInsert) {
	return new Promise((resolve, reject) => {

		// the comments object is a "listing" and NOT the actual array
		const comments = listing[1].data.children;

		// loop through comments
		comments.forEach((comment, i) => {
			if (comment.data.id === parentId && comment.kind !== "more") {
				
				// remove more object
				comment.data.replies.data.children.pop();
				// if comment is parent, insert replies and resolve with new listing
  				ArraytoInsert.map(toInsert => comment.data.replies.data.children.push(toInsert));
				resolve(listing);
			}

			// comment is not parent, but has replies
			if (comment.data.replies) {

				// look if a reply is the parent 
				findIdInRepliesAndInsert(comment.data.replies, parentId, ArraytoInsert)
				.then(listing => listing && resolve(listing))
				.catch(err => console.error(err))
			}
			// reject() oder resolve("someKindOfErrorMessage")
		})

	})

	// recursive function
	function findIdInRepliesAndInsert(replies, parentId, ArraytoInsert) {
		return new Promise((resolve, reject) => {

			// the replies object is a "listing" and NOT the actual array
			const children = replies.data.children;

			// loop over children
			children.forEach((child, i) => {
				
				// check if actual replies and not just links to fetch more replies
				if (child.data.id === parentId && child.kind !== "more") {

					// remove more object
					child.data.replies.data.children.pop();
					// .then insert replies
	  				ArraytoInsert.map(toInsert => child.data.replies.data.children.push(toInsert));
					
					resolve(listing);			
				}
				// reply is not parent, but has replies
				// call self with the replies of the reply
				if (child.data.replies) {

					// look if a reply of reply is the parent 
					findIdInRepliesAndInsert(child.data.replies, parentId, ArraytoInsert)
					.then(listing => resolve(listing)) 
					.catch(err => console.err(err))
				}
			});	
		});
	}
}