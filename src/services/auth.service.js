"use strict";

import { fetchUserData } from "./user.service.js";
import getHashValue from "../helpers/getHashValue";
import tokenIsValid from "../helpers/tokenIsValid";
import history from "../helpers/history";


export function tryLogin() {
  const token = JSON.parse(localStorage.getItem("access_token"));
  
  // check and parse url | values: access_token, token_type, state, expires_in, scope
  const state = getHashValue("state");
  const newToken = {
    value: getHashValue("access_token"),
    expires_in: Date.now() / 1000 + Number(getHashValue("expires_in"))
  }
  
  // validate request and origin
  if (newToken && state === process.env.REACT_APP_SECRET_STRING) {
    console.log("setting new token");
    localStorage.setItem("access_token", JSON.stringify(newToken));
    return fetchUserData(newToken.value);
  }

  // if no params in url check localStorage
  else if (token && tokenIsValid(token)) {
    return fetchUserData(token.value)

  } else {
    return Promise.reject("not logged in");
  }
}

export function logout() {  
	const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";
	localStorage.removeItem("access_token");
	history.push(`${uri}/`);
}