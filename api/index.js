const { parse } = require('querystring');  // for parsing URL query parameters

const getRedirectURL = (currentURL, pageTitle) => {
  if (currentURL.includes('spdmteam.com/key-system-1?hwid=')) {
    return currentURL.replace('https://spdmteam.com/key-system-1?hwid=', 'https://spdmteam.com/api/keysystem?hwid=')
                     .replace('&zone=Europe/Rome', '&zone=Europe/Rome&advertiser=linkvertise&OS=ios');
  } else if (pageTitle.includes("NEO") && pageTitle.includes("1")) {
    return "https://spdmteam.com/api/keysystem?step=1&advertiser=linkvertise&OS=ios";
  } else if (currentURL.includes('spdmteam.com/key-system-2?hwid=')) {
    return "https://loot-link.com/s?mYit";
  } else if (pageTitle.includes("NEO") && pageTitle.includes("2")) {
    return "https://spdmteam.com/api/keysystem?step=2&advertiser=linkvertise&OS=ios";
  } else if (currentURL.includes('spdmteam.com/key-system-3?hwid=')) {
    return "https://loot-link.com/s?qlbU";
  } else if (pageTitle.includes("NEO") && pageTitle.includes("3")) {
    return "https://spdmteam.com/api/keysystem?step=3&advertiser=linkvertise&OS=ios";
  }

  return null;  // Return null if no condition matches
};

module.exports = (req, res) => {
  const { currentURL, pageTitle } = req.query;
  
  // Start time to measure processing duration
  const startTime = Date.now();

  // Handle the redirection logic for spdmteam.com
  if (currentURL.includes('spdmteam.com')) {
    const redirectURL = getRedirectURL(currentURL, pageTitle);
    if (redirectURL) {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;  // Time in milliseconds
      console.log(`Redirect processing time: ${timeTaken} ms`);
      
      // Redirect the client to the final URL
      res.redirect(redirectURL);  // Perform actual redirect
      return;  // Return after redirect
    } else {
      return res.status(400).json({ error: 'No matching condition for redirect' });
    }
  }

  // Handling page title "Just a moment..." if script is not working
  if (pageTitle === 'Just a moment...') {
    return res.status(400).json({ error: 'Script doesn\'t work, please wait for an update (disable the script if you wanna)' });
  }

  // Default response for invalid URL or conditions
  res.status(400).json({ error: 'Invalid URL or conditions' });
};
