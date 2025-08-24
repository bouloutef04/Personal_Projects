const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

app.use(cors())
app.use(express.json())

app.post('/test', async (req, res) => {
  try {
    console.log(req.body)
  } catch (err) {
    return err.message
  }
})

//User API calls
app.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password)
      return res.status(400).json({
        error: 'Missing Username or Password'
      })

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        error: 'Username or Password is not a string'
      })
    }

    const checkUsers = await pool.query(
      'SELECT * FROM Users WHERE user_username = ($1)',
      [username]
    )
    if (checkUsers.rowCount > 0) {
      return res.status(200).json({ error: 'User already exists.' })
    }

    const createUser = await pool.query(
      'INSERT INTO Users (user_username, user_password, user_email) Values ($1, $2, $3) RETURNING *',
      [username, password, email]
    )
    return res.status(200).json({ id: createUser.rows[0].user_id, error: '' })
  } catch (err) {
    console.error(err.message)
    return res.status(400).json({ error: err.message })
  }
})

app.get('/login', async (req, res) => {
  try {
    const { username, password, email } = req.body
    if (!username || !password)
      return res.status(400).json({
        error: 'Missing Username or Password'
      })

    if (typeof username !== 'string' || typeof password !== 'string') {
      if (!username || !password)
        return res.status(400).json({
          error: ' Username or Password is not a string'
        })
    }

    const checkUsers = await pool.query(
      'SELECT * FROM Users WHERE user_username = ($1)',
      [username]
    )
    if (checkUsers.rowCount > 0) {
      return res.status(200).json({ id: checkUsers.rows[0].user_id, error: '' })
    } else {
      return res.status(404).json({ error: 'User not found' })
    }
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

app.put('/updateAccount', async (req, res) => {
  try {
    const { user_id, username, password } = req.body
    if (!user_id || !username || !password) {
      return res.status(400).json({
        error: 'user_id, username or password is missing'
      })
    }

    if (typeof user_id !== 'number')
      return res.status(400).json({
        error: 'user_id is not a number'
      })

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        error: 'username or password is not a string'
      })
    }

    const update = await pool.query(
      'UPDATE Users SET user_username = $1, user_password = $2 WHERE user_id = $3',
      [username, password, user_id]
    )

    res.status(200).json({ error: '' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

app.delete('/deleteAccount', async (req, res) => {
  try {
    const { user_id } = req.body
    if (!user_id) {
      return res.status(400).json({
        error: 'user_id is missing'
      })
    }

    if (typeof user_id !== 'number') {
      return res.status(400).json({
        error: 'user_id is not a number'
      })
    }

    const deleted = await pool.query(
      'DELETE FROM Users WHERE user_id = $1 RETURNING *',
      [user_id]
    )
    return res.status(200).json({ error: 'Account deleted' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

//Games API

app.post('/createGame', async (req, res) => {
  try {
    //Ensure that the frontend sends in empty strings if no input is set
    const {
      game_name,
      user_id,
      game_finished,
      game_totalAchievements,
      game_achievementsEarned,
      game_image,
      game_playTime
    } = req.body

    if (!game_name || !user_id) {
      return res.status(400).json({
        error: 'user_id or game_name is missing'
      })
    }
    if (typeof user_id !== 'number')
      return res.status(400).json({
        error: 'user_id is not a number'
      })

    if (
      typeof game_name !== 'string' ||
      typeof game_totalAchievements !== 'number' ||
      typeof game_achievementsEarned !== 'number' ||
      typeof game_playTime !== 'number'
    ) {
      return res.status(400).json({
        error:
          'game_name is not a string or achievements/playtime are not numbers'
      })
    }
    if (typeof game_finished !== 'boolean' || typeof game_image !== 'string') {
      return res.status(400).json({
        error: 'game_finished is not a boolean or game_image is not a string'
      })
    }

    const newGame = await pool.query(
      'INSERT INTO Games (game_name, game_finished, game_totalAchievements, game_achievementsEarned, game_image, game_playTime, user_id) Values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
      [
        game_name,
        game_finished,
        game_totalAchievements,
        game_achievementsEarned,
        game_image,
        game_playTime,
        user_id
      ]
    )

    return res.status(200).json({ id: newGame.rows[0].game_id, error: '' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

app.put('/updateGame', async (req, res) => {
  try {
    const {
      game_name,
      user_id,
      game_id,
      game_finished,
      game_totalAchievements,
      game_achievementsEarned,
      game_image,
      game_playTime
    } = req.body

    if (!game_name || !user_id || !game_id) {
      return res.status(400).json({
        error: 'game_id, user_id or game_name is missing'
      })
    }
    if (typeof game_id !== 'number' || typeof user_id !== 'number')
      return res.status(400).json({
        error: 'game_id or user_id is not a number'
      })

    if (
      typeof game_name !== 'string' ||
      typeof game_totalAchievements !== 'number' ||
      typeof game_achievementsEarned !== 'number' ||
      typeof game_playTime !== 'number'
    ) {
      return res.status(400).json({
        error:
          'game_name is not a string or achievements/playtime are not numbers'
      })
    }
    if (typeof game_finished !== 'boolean' || typeof game_image !== 'string') {
      return res.status(400).json({
        error: 'game_finished is not a boolean or game_image is not a string'
      })
    }

    const update = await pool.query(
      'UPDATE Games SET game_name = $1, game_finished = $2, game_totalAchievements = $3, game_achievementsEarned = $4, game_image = $5, game_playTIme = $6 WHERE game_id = $7',
      [
        game_name,
        game_finished,
        game_totalAchievements,
        game_achievementsEarned,
        game_image,
        game_playTime,
        game_id
      ]
    )

    res.status(200).json({ error: '' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

app.delete('/deleteGame', async (req, res) => {
  try {
    const { game_id } = req.body

    if (!game_id) {
      return res.status(400).json({
        error: 'game_id is missing'
      })
    }

    if(typeof game_id !== 'number'){
        return res.status(400).json({
        error: 'game_id is not a number'
      })
    }

    const deleteGame = await pool.query(
        'DELETE FROM Games Where game_id = $1 RETURNING *',
        [game_id]
    )

    return res.status(200).json({error: 'Game deleted'})
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})
module.exports = app
