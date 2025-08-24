const app = require('../app')
const request = require('supertest')
const pool = require('../db')

describe('DELETE /deleteGame', () => {
  beforeEach(async () => {
    // Clean up test game if exists
    await pool.query('DELETE FROM Games WHERE game_name = $1', ['_testGame'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new Game, ensure it exists, delete it, and test if no longer exists', async () => {
    const newGame = {
      game_name: '_testGame',
      user_id: 1,
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
    let result = await pool.query(
      'SELECT game_id FROM Games WHERE game_name = $1',
      [newGame.game_name]
    )

    expect(result.rowCount).toBe(1)

    const deleteGame = {
        game_id: result.rows[0].game_id
    }

    const response = await request(app).delete('/deleteGame').send(deleteGame)

    expect(response.statusCode).toBe(200)
    expect(response.body.error).toBe('Game deleted')

    result = await pool.query(
      'SELECT Game_id FROM Games WHERE game_name = $1',
      [newGame.Gamename]
    )
    expect(result.rowCount).toBe(0)
  })

  it('should return error code 400 due to missing Game_id', async () =>{
    const deleteGame = {
        id: 1
    }

    const response = await request(app).delete('/deleteGame').send(deleteGame)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id is missing')
  })

   it('should return error code 400 due to Game_id not being a number', async () =>{
    const deleteGame = {
        game_id: "1"
    }

    const response = await request(app).delete('/deleteGame').send(deleteGame)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id is not a number')
  })
})
