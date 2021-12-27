const https = require('https')
const dotenv = require('dotenv')

dotenv.config()

const currentMembership = (req, res) => {
  console.log('Express Router currentMembership')
  // console.log(req.params)
  // console.log(req)
  // console.log(res)

  const atvSessionCookie = req.cookies.ATVSessionCookie
  console.log('Express Router currentMembership ATVSessionCookie', atvSessionCookie)

  const { CustomerID } = req.query
  console.log(CustomerID)
  const options = {
    host: `account${process.env.API_ENVIRONMENT}.acorn.tv`,
    path: `/currentmembership?CustomerID=${CustomerID}`,
    headers: {
      Cookie: `ATVSessionCookie=${atvSessionCookie}`,
    },
  }

  https.get(options, (resp) => {
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

module.exports = currentMembership
