const https = require('https')
const url = require('url')
const dotenv = require('dotenv')

dotenv.config()

const profile = (req, res) => {
  console.log('Express Router profile')
  // console.log(req.params)
  // console.log(req.url)
  // console.log(res)

  const atvSessionCookie = req.cookies.ATVSessionCookie
  console.log('Express Router profile ATVSessionCookie', atvSessionCookie)

  const { query } = url.parse(req.url, true)
  // console.log(query)
  const queryString = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&')
  const options = {
    host: `store${process.env.API_ENVIRONMENT}.acorn.tv`,
    path: `/profile?${queryString}`,
    // headers: {
    //   'Cookie': `ATVSessionCookie=${atvSessionCookie}`
    // },
  }
  console.log(queryString, options)

  https.get(options, (resp) => {
    // console.log(resp)
    const { statusCode } = resp
    // const contentType = resp.headers['content-type']

    // let error
    // // Any 2xx status code signals a successful response but
    // // here we're only checking for 200.
    // if (statusCode !== 200) {
    //   error = new Error(`Request Failed.
    //     Status Code: ${statusCode}`)
    // } else if (!/^application\/json/.test(contentType)) {
    //   error = new Error(`Invalid content-type.
    //     Expected application/json but received ${contentType}`)
    // }
    // if (error) {
    //   console.error(error.message)
    //   // Consume response data to free up memory
    //   resp.resume()
    //   res.status(statusCode).send(error.message)
    //   return
    // }

    resp.setEncoding('utf8')
    let rawData = ''
    resp.on('data', (chunk) => { rawData += chunk })
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
}

module.exports = profile
