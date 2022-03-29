const path = require('path')
const http = require('http')
const express = require('express')

const https = require('https')
const fs = require('fs')

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
  ca: fs.readFileSync(path.join(__dirname, 'cert', 'chain.pem')),
}

const app = express()

app.get('/', (req, res, next) => {
  res.json({working:true});
})

app.enable('trust proxy')
app.use((request, response, next)=> {
    if (process.env.NODE_ENV != 'development' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }
    next();
})

const port = process.env.PORT || 10000

const sslServer = https.createServer(sslOptions, app)

const server = sslServer.listen(port, () =>
  console.log(`Server started at port ${port}`)
)