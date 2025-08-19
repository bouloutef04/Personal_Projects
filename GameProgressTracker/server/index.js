const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.post("/test", async (req, res)=>{
    try{console.log(req.body);}
    catch (err){return err.message}
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body

    if ((username || password) == null)
      return res.status(400).json({
        error: 'Missing Username or Password'
      })

    if (typeof username !== 'string' || typeof password !== 'string') {
        if((username || password) == null)
            return res.status(400).json({
        error: 'Missing Username or Password'
    })
    }

    const createUser = await pool.query("INSERT INTO Users (user_username, user_password, user_email) Values ($1, $2, $3)", [username, password, email]);
    return res.status(200).json("User was created.");
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({error: err.message});
  }
});

app.listen(5001, () => {
    console.log("The server has started on port 5001");
});