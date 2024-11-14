const { parse } = require('querystring');  // for parsing URL query parameters

const getRedirectURL = (currentURL, pageTitle) => {
  // Your URL logic here
};

module.exports = (req, res) => {
  const { currentURL, pageTitle } = req.query;

  if (currentURL.includes('spdmteam.com')) {
    const redirectURL = getRedirectURL(currentURL, pageTitle);
    if (redirectURL) {
      return res.status(200).json({ redirectURL });
    } else {
      return res.status(400).json({ error: 'No matching condition for redirect' });
    }
  }

  if (pageTitle === 'Just a moment...') {
    return res.status(400).json({ error: 'script doesn\'t work, please wait for an update (disable the script if you wanna)' });
  }

  res.status(400).json({ error: 'Invalid URL or conditions' });
};
