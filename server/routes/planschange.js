const https = require('https')

const plansChange = function (req, res) {
  // const cookie = req.params.sessionID
  console.log('Express Router plansChange')
  // console.log(req.params)
  console.log(req.headers)
  // console.log(res.headers)

  const atvSessionCookie = req.cookies['ATVSessionCookie']
  console.log('Express Router plansChange ATVSessionCookie', atvSessionCookie);

  const postData = JSON.stringify(req.body)
  const options = {
    host: 'account-dev3.acorn.tv',
    path: '/acorn/plans/change',
    method: 'POST',
    headers: {
      // 'Cookie': `ATVSessionCookie=${atvSessionCookie}`
      'Content-Type': 'application/json',
      'StripeMembershipID': req.headers['stripemembershipid'],
      'CustomerID': req.headers['customerid'],
      'StripeCardToken': req.headers['stripecardtoken'],
    },
  }

  console.log(postData)
  console.log(options)

  let httpsReq = https.request(options, (resp) => {
    // console.log(resp)
    const { statusCode } = resp;
    const contentType = resp.headers['content-type'];
    console.log(statusCode, contentType)

    // let error;
    // // Any 2xx status code signals a successful response but
    // // here we're only checking for 200.
    // if (statusCode !== 200) {
    //   error = new Error('Request Failed.\n' +
    //     `Status Code: ${statusCode}`);
    // } else if (!/^application\/json/.test(contentType)) {
    //   error = new Error('Invalid content-type.\n' +
    //     `Expected application/json but received ${contentType}`);
    // }
    // if (error) {
    //   console.error(error.message);
    //   // Consume response data to free up memory
    //   resp.resume();
    //   return;
    // }

    resp.setEncoding('utf8');
    let rawData = '';
    resp.on('data', (chunk) => {
      console.log(chunk)
      rawData += chunk;
    });
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

  httpsReq.write(postData)
  httpsReq.end()
}

module.exports = plansChange
