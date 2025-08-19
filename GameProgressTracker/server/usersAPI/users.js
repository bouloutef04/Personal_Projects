const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

app.use(cors())
app.use(express.json())

app.put('/gametracker/users/signup', async (req, res) => {
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

    const createUser = await pool.query("INSERT INTO Users (user_username, user_password) Values $1", [req.body]);
    res.json("User was created.");
  } catch (err) {
    console.error(err)
  }
});
