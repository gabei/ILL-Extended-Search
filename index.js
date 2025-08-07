import initWorldcat from './login/worldcat/worldcat-login.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT;


app.use((req, res, next) => {
  // Set CORS headers manually
  res.set({
    "Access-Control-Allow-Origin": 'https://gabei.github.io',
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "GET"
  })
  next();
});

app.use((req, res, next) => {
  console.log("New request received at " + new Date().toISOString());
  console.log("Request ip (req.ip): ", req.ip);
  next();
});

app.use(express.json());



app.use((err, req, res, next) => {
  console.log("Error caught in middleware");
  console.error(err.stack);
  res.status(500).json("Something went wrong. Double check the supplied lookup code and try again.");
});

app.get("/", async (req, res, next) => {
  res.redirect("/search");
})

app.get("/search", async (req, res, next) => {
  const ISBN = req.query.code
  let libraryList = await initWorldcat(ISBN);
  res.json(libraryList);
});

app.listen(port || 8000, () => {
  console.log("App listening on port " + port);
})