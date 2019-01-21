"use strict";

// exports: 
	// convertListingToScript()
	// findInListingAndInsert()
	// findIdInListing()

// search

// vote

// sort

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