const express = require('express')
const app = express()

app.use(express.static('dist'))

app.listen(3000, function () {
  console.log('View the app at http://localhost:3000/')
})