//index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const messagesRouter= require('./router/messagesRouter');



const app = express();
app.use(cors())


// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));


//Define routes
app.use("/messages",messagesRouter);

const port = process.env.PORT || 8080;

/* app.get('/', (req, res) => {
  res.send('Hello World!')
}); */


  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});