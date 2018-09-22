const convertToHoursAgo = then => {
  // then has to be a UNIX string
  const now = Date.now();

  // time since "then" in seconds
  let converted = Math.round((now - then) / 1000);

  // determine which unit is appropriate
  if (converted < 10) {
    converted = "Just now";
  } else if (converted < 60) {
    converted = Math.round(converted) + " seconds ago";
  } else if (converted < 60*60) {
    converted = Math.round(converted / 60) + " minutes ago";
  } else if (converted < 60*60*24) {
    converted = Math.round(converted / (60*60)) + " hours ago";
  } else if (converted < 60*60*24*30) {
    converted = Math.round(converted / (60*60*24)) + " days ago";
  } else if (converted < 60*60*24*365) {
    converted = Math.round(converted / (60*60*24*30)) + " months ago";
  } else if (converted >= 60*60*24*365) {
    converted = Math.round(converted / (60*60*24*365)) + " years ago";
  }

  // if singular remove "s" from units
  if (converted[0] < 2) {
    const i = converted.indexOf("s");
    converted = converted.slice(0, i) + " ago";
  }
  return converted;
}

export default convertToHoursAgo;