"use strict";

// exports: 
// convertListingToScript()
// findIdInListing()


// search

// vote

// morebutton


// makes array of strings to pass to speechSynthesis;
export function convertListingToScript(listing, readmode) {
	let script = [];

	const title =  listing[0].data.children[0].data.title;
	const post = listing[0].data.children[0].data.selftext;
	const comments = listing[1].data.children;

	// push title, post and comments to array in order and read out
	title && script.push(cleanString(title));
	post && script.push(cleanString(post));

	// push comments and replies to array
	comments.map((c, i) => {
		script.push(` ${c.data.author} comments: ? ` + cleanString(c.data.body));
		
		if (readmode === "STANDARD") {
			pushReplies(c.data.replies, script);
		}
	});
	return script;
}

// recursive function
function pushReplies(replies, script) {

	if (replies && replies.kind !== "more") {

		// the replies object is a "listing" and NOT the actual array
		const children = replies.data.children;

		// loop over children
		children.map((child, i) => {

			// check if actual replies and not just links to fetch more replies
			if (child.kind !== "more") {

				// if it is push reply body to array
				script.push(` ${child.data.author} replies: ? ` + cleanString(child.data.body));

				// call self with the replies of the reply
				pushReplies(child.data.replies, script);
			};
		});
	}
}

function cleanString(str) {
	if (!str) {
		return null;
	}
	return str.replace(/[^\w\s.:,_$@%;-=`´'/!?]/gi, '');
}

// ===========  ===========

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