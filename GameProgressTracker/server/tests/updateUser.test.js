const app = require('../app')
const request = require('supertest')
const pool = require('../db')

describe('PUT /updateAccount', () => {
  beforeEach(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM Users WHERE user_username = $1', ['_test'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new user and update its password return status 200 with user id', async () => {
    let newUser = {
      username: '_test',
      password: 'password',
      email: 'temp@gmail.com'
    }

    // Optionally verify user exists in DB:
    const newUserQuery = await pool.query(
      'INSERT INTO Users (user_username, user_password, user_email) Values ($1, $2, $3) RETURNING *',
      [newUser.username, newUser.password, newUser.email]
    )

    newUser = {
      user_id: newUserQuery.rows[0].user_id,
      username: '_test',
      password: 'newTestPassword',
      email: 'temp@gmail.com'
    }

    const response = await request(app).put('/updateAccount').send(newUser)

    expect(response.body.error).toBe('')
    expect(response.statusCode).toBe(200)
  })

  it('should not update and return status 400 due to missing items', async () => {
    const newUser = {
      username: '_test',
      password: 'test',
      email: 'temp@gmail.com'
    }

    const newUser2 = {
      user_id: 1,
      password: 'password',
      email: 'temp@gmail.com'
    }

    let response = await request(app).put('/updateAccount').send(newUser)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id, username or password is missing')

    response = await request(app).put('/updateAccount').send(newUser2)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id, username or password is missing')
  })

  it('should not update and return status 400 due to incorrect data types', async () => {
    const newUser = {
      user_id: '1',
      username: '_test',
      password: 'test',
      email: 'temp@gmail.com'
    }

    const newUser2 = {
      user_id: 1,
      username: 1,
      password: 'password',
      email: 'temp@gmail.com'
    }

    let response = await request(app).put('/updateAccount').send(newUser)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('user_id is not a number')

    response = await request(app).put('/updateAccount').send(newUser2)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('username or password is not a string')
  })
})
