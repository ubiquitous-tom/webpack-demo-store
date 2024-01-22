const https = require('https')
const dotenv = require('dotenv')

dotenv.config()

const initializeAppPost = (req, res) => {
  // const cookie = req.params.sessionID
  console.log('Express Router initializeAppPost')
  // console.log(req.params)
  // console.log(req)
  // console.log(res)

  const atvSessionCookie = req.cookies.ATVSessionCookie
  console.log('Express Router initializeAppPost ATVSessionCookie', atvSessionCookie)

  const postData = JSON.stringify(req.body)
  const options = {
    host: `store${process.env.API_ENVIRONMENT}.acorn.tv`,
    // port: 443,
    path: '/initializeapp',
    method: 'POST',
    headers: {
      // 'Cookie': `ATVSessionCookie=${atvSessionCookie}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json',
      // 'Content-Length': Buffer.byteLength(postData),
      // 'Content-Length': postData.length
    },
  }

  console.log(postData)
  console.log(options)

  const httpsReq = https.request(options, (resp) => {
    // console.log(resp)
    const { statusCode } = resp
    const contentType = resp.headers['content-type']
    console.log(statusCode, contentType)

    // let error
    // // Any 2xx status code signals a successful response but
    // // here we're only checking for 200.
    // if (statusCode !== 200) {
    //   error = new Error('Request Failed.\n' +
    //     `Status Code: ${statusCode}`)
    // } else if (!/^application\/json/.test(contentType)) {
    //   error = new Error('Invalid content-type.\n' +
    //     `Expected application/json but received ${contentType}`)
    // }
    // if (error) {
    //   console.error(error.message)
    //   // Consume response data to free up memory
    //   resp.resume()
    //   return
    // }

    resp.setEncoding('utf8')
    let rawData = ''
    resp.on('data', (chunk) => {
      console.log(chunk)
      rawData += chunk
    })
    resp.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData)
        console.log('parseData', parsedData)
        res.status(statusCode).send(parsedData)
      } catch (e) {
        console.error(e.message)
        res.status(statusCode).send(e.message)
      }
    })
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
    res.status(400).send(e.message)
  })

  httpsReq.write(postData)
  httpsReq.end()
}

module.exports = initializeAppPost
