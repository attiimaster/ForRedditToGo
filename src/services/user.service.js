"use strict";

// handlesort
// fetchSubredditPosts

// exports: 
	// fetchUserData()
	// findInListingAndInsert()
	// findIdInListing() - legacy

// search

// vote

// sort
function includeSorting(params) {
	const generalParam = params && params.value || "";
    const topOfAllParam = generalParam === "top" ? `&t=${params.top}` : "";

    return `/${generalParam}.json?limit=100${topOfAllParam}`;
}

// 
function suggestTextFocusedSubreddits() {
	return ["askreddit", "showerthoughts"];
}

// =========== api ============

export async function fetchFrontpage(mySubreddits, sortParams) {
	// actual frontpage `https://www.reddit.com/.json?limit=100`
    console.log(mySubreddits)
    // if user has no subreddits or is not logged in, populate frontpage with predetermined subreddits
    mySubreddits = mySubreddits ?
    	mySubreddits.map(sub => sub.data.display_name)
    	:
    	suggestTextFocusedSubreddits();

    const res = await fetch(`https://www.reddit.com/r/${mySubreddits.join("+")}${includeSorting(sortParams)}`)
    return res.json();
}

export function fetchSortedSubreddit() {}

export function fetchSortedThread() {}

export function fetchUserData(token) {
  	return Promise.all([
  		// fetch users reddit profile
		fetchWithToken("/api/v1/me", token),
  		// fetch list of users subscribed subreddits
		fetchWithToken("/subreddits/mine/subscriber", token)
	]);
}

async function fetchWithToken(path, token) {
	// token = token || JSON.parse(localStorage.getItem("access_token"));
	const options = {
	  headers: {
	    Authorization: `bearer ${token}`
	  }
	}
	const res = await fetch(`https://oauth.reddit.com${path}`, options);
	return res.json();
}

// =========== more button functionality ============

// takes listing and additional replies and merges them
export function findInListingAndInsert(listing, parentId, ArraytoInsert) {
	return new Promise((resolve, reject) => {

		// the comments object is a "listing" and NOT the actual array
		const comments = listing[1].data.children;

		// loop through comments
		comments.map((comment, i) => {
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
			children.map((child, i) => {
				
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

// ==================== legacy ======================

export function findIdInListing(listing, parentId) {
	return new Promise((resolve, reject) => {
		const comments = listing[1].data.children;

		// if more comments can be ŕequested via /morechildren => check threadId

		comments.map((c, i) => {
			if (c.data.id === parentId && c.kind !== "more") {
				console.log("parentId:", parentId);
				console.log("comment:", c.data);
				// console.log("\nreply of comment\narr to push onto:\n", c.data.replies.data.children);

				// fetch additional comments / replies
				// fetch("/morechildren")

				// .then insert comment / replies
				// comments.data.replies.data.children.push()

				resolve(i.toString());
			}

			if (c.data.replies) {
				findIdInReplies(c.data.replies, parentId)
				.then(iterators => {
					iterators && resolve(i + iterators) 
				})
			}
		})

	})
}

// recursive function
function findIdInReplies(replies, parentId) {
	return new Promise((resolve, reject) => {

		// the replies object is a "listing" and NOT the actual array
		const children = replies.data.children;

		// loop over children
		children.map((child, i) => {
			
			// check if actual replies and not just links to fetch more replies
			if (child.data.id === parentId && child.kind !== "more") {
				console.log("parentId:", parentId);
				console.log("child:", child.data);
				// console.log("\nchild of child\narr to push onto:\n", child.data.replies.data.children);

				// fetch additional comments / replies
				// fetch("/morechildren")

				// .then insert replies
				// comments.data.replies.data.children.push()
				resolve(i.toString());			
			}
			// call self with the replies of the reply
			if (child.data.replies) {
				findIdInReplies(child.data.replies, parentId)
				.then(iterators => {
					iterators && resolve(i.toString() + iterators) 
				})
				.catch(err => () => console.log("reject"))
			}
		});	
	});
}