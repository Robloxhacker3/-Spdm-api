const express = require('express');
const { parse } = require('querystring'); // for parsing URL query parameters

const app = express();
const port = process.env.PORT || 3000;

const getRedirectURL = (currentURL, pageTitle) => {
  // Check for conditions on spdmteam.com URLs
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

app.get('/api/spdm-redirect', (req, res) => {
  const { currentURL, pageTitle } = req.query;
  const startTime = Date.now();

  if (currentURL.includes('spdmteam.com')) {
    const redirectURL = getRedirectURL(currentURL, pageTitle);
    if (redirectURL) {
      const timeTaken = Date.now() - startTime;
      return res.status(200).send(`Redirecting took ${timeTaken}ms`);
    } else {
      return res.status(400).send("Error: No matching condition for redirect");
    }
  }

  if (pageTitle === 'Just a moment...') {
    return res.status(400).send("Error: Script doesn't work, please wait for an update (disable the script if you want to)");
  }

  return res.status(400).send("Error: Invalid URL or conditions");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
