const express = require('express');
const { parse } = require('querystring'); // for parsing URL query parameters

const app = express();

const getRedirectURL = (currentURL, pageTitle) => {
  console.log("Checking redirection for:", { currentURL, pageTitle });

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

  console.log("Received request with:", { currentURL, pageTitle });

  if (currentURL.includes('spdmteam.com')) {
    const redirectURL = getRedirectURL(currentURL, pageTitle);
    console.log("Calculated redirect URL:", redirectURL);

    if (redirectURL) {
      const timeTaken = Date.now() - startTime;
      console.log(`Redirecting took ${timeTaken}ms`);
      
      // Send a message to the client with the redirect time
      return res.send(`
        <html>
          <body>
            <h2>Redirecting...</h2>
            <p>Time taken: ${timeTaken}ms</p>
            <p>Redirecting to the bypass...</p>
            <script>
              setTimeout(() => {
                window.location.href = "${redirectURL}";  // Perform actual redirect after 2 seconds
              }, 2000);
            </script>
          </body>
        </html>
      `);
    } else {
      const timeTaken = Date.now() - startTime;
      console.log(`Error: No matching condition for redirect. Took ${timeTaken}ms`);
      
      // Send error message if no matching condition
      return res.send(`
        <html>
          <body>
            <h2>Error: No matching condition for redirect</h2>
            <p>Time taken: ${timeTaken}ms</p>
          </body>
        </html>
      `);
    }
  }

  // If pageTitle is 'Just a moment...', display message and stop execution
  if (pageTitle === 'Just a moment...') {
    const timeTaken = Date.now() - startTime;
    console.log(`Error: Page title 'Just a moment...'. Took ${timeTaken}ms`);
    return res.send(`
      <html>
        <body>
          <h2>Error: Script doesn't work, please wait for an update (disable the script if you want to)</h2>
          <p>Time taken: ${timeTaken}ms</p>
        </body>
      </html>
    `);
  }

  // Error for invalid URL or conditions
  const timeTaken = Date.now() - startTime;
  console.log(`Error: Invalid URL or conditions. Took ${timeTaken}ms`);
  return res.send(`
    <html>
      <body>
        <h2>Error: Invalid URL or conditions</h2>
        <p>Time taken: ${timeTaken}ms</p>
      </body>
    </html>
  `);
});

// Listen on the default port (80) without specifying the port in the environment
app.listen(80, () => {
  console.log(`Server running on port 80`);
});
