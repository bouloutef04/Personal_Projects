const app = require('../app')
const request = require('supertest')
const pool = require('../db')
// module.exports = handler;
// const express = require('express');

describe('POST /createGame', () => {
  beforeEach(async () => {
    // Clean up test game if exist
    await pool.query('DELETE FROM Games WHERE game_name = $1', ['_testGame'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new game and return status 200 with Game id', async () => {
    const newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }

    const response = await request(app).post('/createGame').send(newGame)

    expect(response.statusCode).toBe(200)
    expect(response.body.error).toBe('')

    // Optionally verify Game exists in DB:
    const result = await pool.query(
      'SELECT game_id FROM Games WHERE game_name = $1',
      [newGame.game_name]
    )
    expect(result.rowCount).toBe(1)
    expect(response.body.id).toBe(result.rows[0].game_id)
  })

  it('should not create a new game and return status 400 due to missing items', async () => {
    const newGame = {
      user_id: 1,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }

    const response = await request(app).post('/createGame').send(newGame)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id or game_name is missing')

    const newGame2 = {
      game_name: '_testGame',
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }

    const response2 = await request(app).post('/createGame').send(newGame2)

    expect(response2.statusCode).toBe(400)
    expect(response2.body.error).toBe('user_id or game_name is missing')

    // Optionally verify Game exists in DB:
    const result = await pool.query(
      'SELECT game_id FROM Games WHERE game_name = $1',
      [newGame.game_name]
    )
    expect(result.rowCount).toBe(0)
  })

  it('should not create a new Game and return status 400 due to incorrect input types', async () => {
    let newGame = {
      game_name: 1,
      user_id: 1,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }
    let response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: false,
      game_totalAchievements: '0',
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }
    response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: '0',
      game_image: ' ',
      game_playTime: 0
    }
    response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

    newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: '0'
    }
    response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe(
      'game_name is not a string or achievements/playtime are not numbers'
    )

        newGame = {
      game_name: '_testGame',
      user_id: '1',
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }
    response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id is not a number');

    newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: 1,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: ' ',
      game_playTime: 0
    }
    response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_finished is not a boolean or game_image is not a string');

    newGame = {
      game_name: '_testGame',
      user_id: 1,
      game_finished: false,
      game_totalAchievements: 0,
      game_achievementsEarned: 0,
      game_image: 0,
      game_playTime: 0
    }
    response = await request(app).post('/createGame').send(newGame)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('game_finished is not a boolean or game_image is not a string');

    


    // Optionally verify Game does not exist in DB:
    const result = await pool.query(
      'SELECT Game_id FROM Games WHERE game_name = $1',
      ['_testGame']
    )
    expect(result.rowCount).toBe(0)
  })
})
