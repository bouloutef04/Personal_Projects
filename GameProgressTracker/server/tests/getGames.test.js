const app = require('../app')
const request = require('supertest')
const pool = require('../db')

describe('GET /getGames', () => {
  beforeEach(async () => {
    // Clean up test game if exists
    await pool.query('DELETE FROM Games WHERE game_name = $1', ['_testGame'])
    await pool.query('DELETE FROM Users WHERE user_username = $1', ['_test'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new user and a game using the new user then return said game', async () => {
    const newUser = {
      username: '_test',
      password: 'password',
      email: 'temp@gmail.com'
    }

    // Create user
    const newUserQuery = await pool.query(
      'INSERT INTO Users (user_username, user_password, user_email) Values ($1, $2, $3) RETURNING *',
      [newUser.username, newUser.password, newUser.email]
    )

    //verify user exists in DB:
    let result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      [newUser.username]
    )

    expect(result.rowCount).toBe(1)

    const newGame = {
      game_name: '_testGame',
      user_id: newUserQuery.rows[0].user_id,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }

    // Create Game
    const insertGame = await pool.query(
      'INSERT INTO Games (game_name, game_finished, game_totalAchievements, game_achievementsEarned, game_image, game_playTime, user_id) Values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
      [
        newGame.game_name,
        newGame.game_finished,
        newGame.game_totalAchievements,
        newGame.game_achievementsEarned,
        newGame.game_image,
        newGame.game_playTime,
        newGame.user_id
      ]
    )

    //verify Game exists in DB:
    result = await pool.query(
      'SELECT game_id FROM Games WHERE game_name = $1',
      [newGame.game_name]
    )

    expect(result.rowCount).toBe(1)

    const userGames = {
      user_id: newUserQuery.rows[0].user_id
    }

    const response = await request(app).get('/getGames').send(userGames)

    expect(response.statusCode).toBe(200)
    expect(response.body.error).toBe('')
  })

  it('should return error code 400 due to missing user_id', async () => {
    const userGames = {
      id: 1
    }
    const response = await request(app).get('/getGames').send(userGames)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id is missing')
  })

  it('should return error code 400 due to user_id not being a number', async () => {
    const userGames = {
      user_id: '1'
    }
    const response = await request(app).get('/getGames').send(userGames)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id is not a number')
  })
})
