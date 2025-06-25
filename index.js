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


app.get("/search", async (req, res)=> {
  try {
    const ISBN = req.query.code
    let libraryList = await initWorldcat(ISBN);
    res.json(libraryList);
  } catch(error) {
    res.status(500).send("Something went wrong. Double check the supplied lookup code and try again.");
  }
  
});