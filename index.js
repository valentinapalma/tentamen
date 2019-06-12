const express = require("express");

const routes = require("./routes")
const db = require("./models")

const app = express();

// environment variable PORT or 3000 if unset
const port = process.env.PORT || 3000;

// Add middleware for parsing the body to req.body
// middlewares are executed in the order added, so add before routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(error.statusCode || error.status || 500).send({error: error })
})

app.use((req, res, next) => {
  req.models = db.models
  next()
})

app.use('/', express.static(__dirname + '/swagger'));
app.use('/', routes);

app.get("/", (req, res) => {
  res.send("Please type in /listings as a parameter to access and see all data")
})


// Start up the database, then the server and begin listen to requests

// Var tvungen att ta bort NODE_ENV från både den här filen och package.json då den inte fungerar på min dator

// if(process.env.NODE_ENV != "test") {
  db.connectDb().then(() => {
    const listener = app.listen(port, () => {
      console.info(`Server is listening on port ${listener.address().port}.`);
    })
  }).catch((error) => {
    console.error(error)
  })
// }

module.exports = app