

import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());

app.listen(port || 3000, () => {
  console.log("App listening on port " + port);
})

app.get("/", (err, req, res)=> {
  res.send("You hit the home page!");
});