const app = require('../app')
const request = require('supertest')
const pool = require('../db')

describe('PUT /updateGame', () => {
  beforeEach(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM Games WHERE game_name = $1', ['_testGame'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new game and update its playtime return status 200 with game id', async () => {
    let newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }
    const newGameRes = await pool.query(
      'INSERT INTO Games (game_name, game_finished, game_totalachievements, game_achievementstimeearned, game_image, game_playtime, user_id) Values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
      [
        newGame.game_name,
        newGame.game_finished,
        newGame.game_totalachievements,
        newGame.game_achievementstimeearned,
        newGame.game_image,
        newGame.game_playtime,
        newGame.user_id
      ]
    )

    newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_id: newGameRes.rows[0].game_id,
      game_finished: true,
      game_totalachievements: 20,
      game_achievementstimeearned: 8,
      game_image: 'fakeImage',
      game_playtime: 7
    }

    const response = await request(app).put('/updateGame').send(newGame)
    expect(response.body.error).toBe('')
    expect(response.statusCode).toBe(200)

    const result = await pool.query(
      'SELECT game_id FROM Games WHERE game_image = $1',
      [newGame.game_image]
    )

    expect(result.rowCount).toBe(1)
  })

  it('should not update and return status 400 due to missing items', async () => {
    const newGame = {
      user_id: 1,
      game_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    const newGame2 = {
      game_id: 1,
      game_name: '_testGame',
      game_finished: false,
      game_totalcchievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    const newGame3 = {
      user_id: 1,
      game_name: '_testGame',
      game_finished: false,
      game_totalcchievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    let response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id, user_id or game_name is missing')

    response = await request(app).put('/updateGame').send(newGame2)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id, user_id or game_name is missing')

    response = await request(app).put('/updateGame').send(newGame3)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id, user_id or game_name is missing')

    const result = await pool.query(
      'SELECT game_id FROM Games WHERE game_name = $1',
      [newGame.game_image]
    )

    expect(result.rowCount).toBe(0)
  })

  it('should not update and return status 400 due to incorrect data types', async () => {
    let newGame = {
      user_id: '1',
      game_name: '_testGame',
      game_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    let response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id or user_id is not a number')

    newGame = {
      user_id: 1,
      game_name: '_testGame',
      game_id: '1',
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_id or user_id is not a number')

    newGame = {
      user_id: 1,
      game_name: true,
      game_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      user_id: 1,
      game_name: '_testGame',
      game_id: 1,
      game_finished: false,
      game_totalachievements: '0',
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      user_id: 1,
      game_name: '_testGame',
      game_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: '0',
      game_image: ' ',
      game_playtime: 0
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      user_id: 1,
      game_name: '_testGame',
      game_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: '0'
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      user_id: 1,
      game_name: '_testGame',
      game_id: 1,
      game_finished: 20,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: ' ',
      game_playtime: 0
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_finished is not a boolean or game_image is not a string'
    )

    newGame = {
      user_id: 1,
      game_name: '_testGame',
      game_id: 1,
      game_finished: false,
      game_totalachievements: 0,
      game_achievementstimeearned: 0,
      game_image: 2,
      game_playtime: 0
    }

    response = await request(app).put('/updateGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_finished is not a boolean or game_image is not a string'
    )

    const result = await pool.query(
      'SELECT game_id FROM Games WHERE game_name = $1',
      [newGame.game_image]
    )

    expect(result.rowCount).toBe(0)
  })
})
