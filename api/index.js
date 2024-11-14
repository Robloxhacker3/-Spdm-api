const express = require('express');
const { parse } = require('querystring'); // for parsing URL query parameters

const app = express();

// Function to determine the redirect URL based on the current URL and page title
const getRedirectURL = (currentURL, pageTitle) => {
  if (currentURL.includes('spdmteam.com/key-system-1?hwid=')) {
    return currentURL.replace('https://spdmteam.com/key-system-1?hwid=', 'https://spdmteam.com/api/keysystem?hwid=')
                     .replace('&zone=Europe/Rome', '&zone=Europe/Rome&advertiser=lootlabs&OS=ios');
  } else if (pageTitle.includes("NEO") && pageTitle.includes("1")) {
    return "https://spdmteam.com/api/keysystem?step=1&advertiser=lootlabs&OS=ios";
  } else if (currentURL.includes('spdmteam.com/key-system-2?hwid=')) {
    return "https://loot-link.com/s?mYit";
  } else if (pageTitle.includes("NEO") && pageTitle.includes("2")) {
    return "https://spdmteam.com/api/keysystem?step=2&advertiser=lootlabs&OS=ios";
  } else if (currentURL.includes('spdmteam.com/key-system-3?hwid=')) {
    return "https://loot-link.com/s?qlbU";
  } else if (pageTitle.includes("NEO") && pageTitle.includes("3")) {
    return "https://spdmteam.com/api/keysystem?step=3&advertiser=lootlabs&OS=ios";
  }
  
  return null; // Return null if no matching condition
};

// Handle the API redirect
app.get('/api/spdm-redirect', (req, res) => {
  const { currentURL, pageTitle } = req.query;
  const startTime = Date.now();

  // Attempting to process all three key systems
  const steps = [
    { step: 1, url: 'spdmteam.com/key-system-1?hwid=' },
    { step: 2, url: 'spdmteam.com/key-system-2?hwid=' },
    { step: 3, url: 'spdmteam.com/key-system-3?hwid=' }
  ];

  // Sequential processing of key system redirects
  let redirectURL = null;

  for (let i = 0; i < steps.length; i++) {
    if (currentURL.includes(steps[i].url)) {
      redirectURL = getRedirectURL(currentURL, pageTitle);
      if (redirectURL) {
        break; // Stop once the correct redirect URL is found
      }
    }
  }

  // Check for valid redirect and perform the redirect
  if (redirectURL) {
    const timeTaken = Date.now() - startTime;
    setTimeout(() => {
      res.send(`Redirecting... (Time taken: ${timeTaken}ms)`);
      setTimeout(() => {
        res.redirect(redirectURL);
      }, 2000); // Delay redirect after displaying message
    }, 500); // Small delay before showing the redirect message
  } else {
    // Handle error if no valid redirect URL is found
    res.status(400).send("Error: An issue occurred while processing the redirect.");
  }
});

