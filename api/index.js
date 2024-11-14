const express = require('express');
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
  
  return null;  // Return null if no matching condition
};

// Improved bypass function for redirect logic
const bypassRedirect = (currentURL, pageTitle) => {
  // Define the set of possible redirects
  const redirects = [
    { pattern: 'spdmteam.com/key-system-1?hwid=', redirectURL: 'https://spdmteam.com/api/keysystem?hwid=' },
    { pattern: 'spdmteam.com/key-system-2?hwid=', redirectURL: 'https://loot-link.com/s?mYit' },
    { pattern: 'spdmteam.com/key-system-3?hwid=', redirectURL: 'https://loot-link.com/s?qlbU' }
  ];

  // Loop through and check for any patterns that match the current URL
  for (let i = 0; i < redirects.length; i++) {
    if (currentURL.includes(redirects[i].pattern)) {
      const modifiedURL = currentURL.replace(redirects[i].pattern, redirects[i].redirectURL);
      return modifiedURL;
    }
  }

  // Check for additional NEO steps based on pageTitle if no match is found
  if (pageTitle.includes("NEO") && pageTitle.includes("1")) {
    return "https://spdmteam.com/api/keysystem?step=1&advertiser=lootlabs&OS=ios";
  } else if (pageTitle.includes("NEO") && pageTitle.includes("2")) {
    return "https://spdmteam.com/api/keysystem?step=2&advertiser=lootlabs&OS=ios";
  } else if (pageTitle.includes("NEO") && pageTitle.includes("3")) {
    return "https://spdmteam.com/api/keysystem?step=3&advertiser=lootlabs&OS=ios";
  }

  return null;  // If no valid URL is found, return null
};

// Handle the API redirect
app.get('/api/spdm-redirect', (req, res) => {
  const { currentURL, pageTitle } = req.query;
  const startTime = Date.now();  // Capture start time for measuring redirect time

  if (!currentURL || !pageTitle) {
    res.status(400).send("Error: Missing required parameters 'currentURL' or 'pageTitle'.");
    return;
  }

  // Use the improved bypass function to determine the correct redirect URL
  const redirectURL = bypassRedirect(currentURL, pageTitle);

  // If a valid redirect URL is found, process the redirect
  if (redirectURL) {
    const timeTaken = Date.now() - startTime;  // Calculate the time taken for the redirection

    // Send a message indicating the redirect time and initiate the redirect after a short delay
    setTimeout(() => {
      res.send(`Redirecting... (Time taken: ${timeTaken}ms)`);  // Send the redirect time message

      // Delay the redirect by 2 seconds to allow the user to see the message
      setTimeout(() => {
        res.redirect(redirectURL);  // Perform the actual redirect
      }, 2000);  // 2 seconds delay before redirecting

    }, 500);  // 500ms delay before displaying the redirect message
  } else {
    // If no matching condition is found, return an error message
    res.status(400).send("Error: No valid redirect URL found based on the provided 'currentURL' and 'pageTitle'.");
  }
});

// Start the server (port can be specified for testing purposes)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
