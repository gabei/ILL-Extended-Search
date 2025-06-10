

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

app.get("/search", (req, res)=> {
  const item = req.query.code
  console.log(item)
  res.send(`You sent ${item}!`);
});