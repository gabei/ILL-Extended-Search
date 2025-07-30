import initWorldcat from './login/worldcat/worldcat-login.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();


const app = express();
const port = process.env.PORT;


app.use(cors());
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