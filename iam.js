const request = require('request');

const getToken = (iamURL, oAuthClientUsername, oAuthClientPassword, username, password) => {
  const authHeader = Buffer.from(`${oAuthClientUsername}:${oAuthClientPassword}`).toString('base64');
  const options = {
    method: 'POST',
    json: true,
    url: `${iamURL}/authorize/oauth2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
      Authorization: `Basic ${authHeader}`
    },
    form: {
      grant_type: 'password',
      username,
      password
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if (response.statusCode !== 200) {
        return reject(response);
      }

      return resolve(body.access_token);
    });
  });
};

module.exports = {
  getToken
};