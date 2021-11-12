const https = require('https')

const stripeKey = function (req, res) {
  console.log('Express Router stripeKey')
  // console.log(req)
  // console.log(res)

  const options = {
    host: 'account-dev3.acorn.tv',
    path: '/stripekey',
  }

  https.get(options, (resp) => {
    // console.log(resp)
    const { statusCode } = resp;
    const contentType = resp.headers['content-type'];

    let error;
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      resp.resume();
      return;
    }

    resp.setEncoding('utf8');
    let rawData = '';
    resp.on('data', (chunk) => { rawData += chunk; });
    resp.on('end', () => {
      try {
        parsedData = JSON.parse(rawData);
        console.log('parseData', parsedData);
        res.status(statusCode).send(parsedData)
      } catch (e) {
        console.error(e.message);
        res.status(statusCode).send(e.message)
      }
    })
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    res.status(statusCode).send(e.message)
  })

}

module.exports = stripeKey
