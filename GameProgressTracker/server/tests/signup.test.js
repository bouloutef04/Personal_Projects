const app = require('../app')
const request = require('supertest')
const pool = require('../db')
// module.exports = handler;
// const express = require('express');

describe('POST /signup', () => {
  beforeEach(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM Users WHERE user_username = $1', ['_test'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new user and return status 200 with user id', async () => {
    const newUser = {
      username: '_test',
      password: 'password',
      email: 'temp@gmail.com'
    }

    const response = await request(app).post('/signup').send(newUser)

    expect(response.statusCode).toBe(200)
    expect(response.body.error).toBe('')

    // Optionally verify user exists in DB:
    const result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      [newUser.username]
    )
    expect(result.rowCount).toBe(1)
    expect(response.body.id).toBe(result.rows[0].user_id)
  })

  it('should not create a new user and return status 400 due to missing items', async () => {
    const newUser = {
      username: '_test',
      email: 'temp@gmail.com'
    }

    const response = await request(app).post('/signup').send(newUser)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Missing Username or Password')

    const newUser2 = {
      password: 'password',
      email: 'temp@gmail.com'
    }

    const response2 = await request(app).post('/signup').send(newUser2)

    expect(response2.statusCode).toBe(400)
    expect(response2.body.error).toBe('Missing Username or Password')

    // Optionally verify user exists in DB:
    const result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      [newUser.username]
    )
    expect(result.rowCount).toBe(0)
  })

  it('should not create a new user and return status 400 due to incorrect input types', async () => {
    let newUser = {
      username: '_test',
      password: 1,
      email: 'temp@gmail.com'
    }

    let response = await request(app).post('/signup').send(newUser)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Username or Password is not a string');

    newUser ={
      username: 1,
      password: 'password',
      email: 'temp@gmail.com'
    }

    response = await request(app).post('/signup').send(newUser)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Username or Password is not a string');


    // Optionally verify user does not exist in DB:
    const result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      ['_test']
    )
    expect(result.rowCount).toBe(0)
  })
})
