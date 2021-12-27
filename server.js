const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.dev')

const compiler = webpack(config)

// Tell express to use the webpack-dev-middleware and use the webpack.dev.js
// configuration file as a base.
/* eslint comma-dangle: 0 */
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
)

// app.get('/api', (req, res) => {
//   res.send(mockResponse)
// })

app.get('/hello', (req, res) => {
  res.status(200).send('Hello World!')
})

// Serve the files on port 3000.
app.listen(3000, () => {
  console.log('Example app listening on port 3000!\n')
})
