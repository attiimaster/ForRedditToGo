const convertToHoursAgo = then => {
  // then has to be a UNIX string
  const now = Date.now();

  // time since "then" in hours
  let converted = Math.round((now - then) / 1000 / 60 / 60);
  
  // determine which unit is appropriate
  if (converted / 24 > 1) {
  	converted = Math.round(converted / 24)

  	if (converted >= 2) { converted += " days ago"; } 
  	else { converted += " day ago"; }

  } else {
  	
  	if (converted >= 2) { converted += " hours ago"; } 
  	else { converted += " hour ago"; }
  }

  return converted;
}

export default convertToHoursAgo;