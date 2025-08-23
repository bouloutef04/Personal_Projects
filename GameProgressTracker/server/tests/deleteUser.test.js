const app = require('../app')
const request = require('supertest')
const pool = require('../db')
// module.exports = handler;
// const express = require('express');

describe('DELETE /deleteAccount', () => {
  beforeEach(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM Users WHERE user_username = $1', ['_test'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new user, ensure it exists, delete it, and test if no longer exists', async () => {
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

    const deleteUser = {
        user_id: result.rows[0].user_id
    }

    const response = await request(app).delete('/deleteAccount').send(deleteUser)

    expect(response.statusCode).toBe(200)
    expect(response.body.error).toBe('Account deleted')

    result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      [newUser.username]
    )
    expect(result.rowCount).toBe(0)
  })

  it('should return error code 400 due to missing user_id', async () =>{
    const deleteUser = {
        id: 1
    }

    const response = await request(app).delete('/deleteAccount').send(deleteUser)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id is missing')
  })

   it('should return error code 400 due to user_id not being a number', async () =>{
    const deleteUser = {
        user_id: "1"
    }

    const response = await request(app).delete('/deleteAccount').send(deleteUser)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id is not a number')
  })
})
