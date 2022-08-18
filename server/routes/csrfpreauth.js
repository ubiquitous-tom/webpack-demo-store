const https = require('https')
const dotenv = require('dotenv')

dotenv.config()

const csrfPreAuth = (req, res) => {
  console.log('Express Router csrfPreAuth')
  console.log(req.headers, req.headers['csrf-token'])
  console.log(req.body)

  const atvSessionCookie = req.cookies.ATVSessionCookie
  console.log('Express Router csrfPreAuth ATVSessionCookie', atvSessionCookie)

  const postData = JSON.stringify(req.body)
  const queryString = new URLSearchParams(req.body.country).toString()
  const options = {
    host: `account${process.env.API_ENVIRONMENT}.acorn.tv`,
    path: '/api/user/csrfPreAuth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'csrf-token': req.headers['csrf-token'],
    },
  }

  console.log(queryString, postData)
  console.log(options)

  const httpsReq = https.request(options, (resp) => {
    // console.log(resp)
    const { statusCode } = resp
    const contentType = req.headers['content-type']
    console.log('statusCode', statusCode)
    console.log(contentType)

    // let error
    // // Any 2xx status code signals a successful response but
    // // here we're only checking for 200.
    // if (statusCode !== 200) {
    //   error = new Error('Request Failed.\n'
    //     + `Status Code: ${statusCode}`)
    // } else if (!/^application\/json/.test(contentType)) {
    //   error = new Error('Invalid content-type.\n'
    //     + `Expected application/json but received ${contentType}`)
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
        const parsedData = JSON.parse(JSON.stringify(rawData))
        console.log('statusCode', statusCode)
        console.log('parseData', parsedData)
        res.send(JSON.stringify(rawData))
      } catch (e) {
        console.log(e)
        console.log('statusCode', statusCode)
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

module.exports = csrfPreAuth
