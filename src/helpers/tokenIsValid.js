function tokenIsValid(token) {
  const timeRemaining = token.expires_in - (Date.now() / 1000);
  
  if (timeRemaining > 0) {
    console.log("timeRemaining:", timeRemaining + " sec");
    return true;
  }    

  return false;
}

export default tokenIsValid;
 

/* 
console.log(
  	tokenIsValid({
  		value: "string",
  		expires_in: Date.now() / 1000 + 3600
  	})
)
  
console.log(
  	tokenIsValid({
  		value: "string",
  		expires_in: Date.now() / 1000
  	})
)
*/