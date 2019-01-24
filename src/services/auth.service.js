import { fetchUserData } from "./user.service.js";
import getHashValue from "../helpers/getHashValue";
import accesstoken from "../helpers/accesstoken";
import tokenIsValid from "../helpers/tokenIsValid";
import history from "../helpers/history";

export default {
  tryLogin,
  logout
}

export function tryLogin() {
  const token = accesstoken.get();
  
  // check and parse url | values: access_token, token_type, state, expires_in, scope
  const state = getHashValue("state");
  const newToken = {
    value: getHashValue("access_token"),
    expires_in: Date.now() / 1000 + Number(getHashValue("expires_in"))
  }
  
  // validate request and origin
  if (newToken && state === process.env.REACT_APP_SECRET_STRING) {
    console.log("setting new token");
    accesstoken.set(newToken);
    return fetchUserData(newToken);
  }

  // if no params in url check localStorage
  else if (token && tokenIsValid(token)) {
    return fetchUserData(token);

  } else {
    accesstoken.remove();
    return Promise.reject("not logged in");
  }
}

export function logout() {  
	const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";
  accesstoken.remove();
	history.push(`${uri}/`);
}