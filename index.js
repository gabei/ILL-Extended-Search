import initWorldcat from './login/worldcat/worldcat-login.js';

import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.listen(port || 3000, () => {
  console.log("App listening on port " + port);
})

app.get("/search", async (req, res)=> {
  const ISBN = req.query.code
  // filter for valid ISBN
  let libraryList = await initWorldcat(ISBN);
  res.send(`Libraries:\n ${libraryList}!`);
});