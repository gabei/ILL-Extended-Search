import initWorldcat from './login/worldcat/worldcat-login.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();


const app = express();
const port = process.env.PORT;

// const corsOptions = {
//   origin: ['https://gabei.github.io/LTCL-client/',
//     'http://gabei.github.io/LTCL-client/',
//   'https://gabei.github.io',
//   'http://gabei.github.io'],
//   methods: ['GET', 'POST'],
// }
// app.use(cors(corsOptions));


app.use(req, res, next => {
  // try set CORS headers manually isntead of using the cors package
  // a la this post: https://stackoverflow.com/questions/72166644/node-and-heroku-error-no-access-control-allow-origin-header-is-present-on-th
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested, Content-Type, Accept Authorization");
  next();
});


app.use(express.json());


app.listen(port || 8000, () => {
  console.log("App listening on port " + port);
})

app.use((err, req, res, next) => {
    console.log("Error caught in middleware");
    console.error(err.stack);
    res.status(500).json("Something went wrong. Double check the supplied lookup code and try again.");
});

app.get("/", async (req, res, next) => {
  res.redirect("/search");
})

app.get("/search", async (req, res, next)=> {
  const ISBN = req.query.code
  let libraryList = await initWorldcat(ISBN);
  res.json(libraryList);
});