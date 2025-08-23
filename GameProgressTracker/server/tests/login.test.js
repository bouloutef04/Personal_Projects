const app = require('../app')
const request = require('supertest')
const pool = require('../db')

describe('GET /login', () => {
  beforeEach(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM Users WHERE user_username = $1', ['_test'])
  })

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end()
  })

  it('should create a new user and login to said user and return status 200 with user id', async () => {
    const newUser = {
      username: '_test',
      password: 'password',
      email: 'temp@gmail.com'
    }

    // Optionally verify user exists in DB:
    const newUserQuery = await pool.query(
      'INSERT INTO Users (user_username, user_password, user_email) Values ($1, $2, $3) RETURNING *',
      [newUser.username, newUser.password, newUser.email]
    )

    const response = await request(app).get('/login').send(newUser)

    expect(response.statusCode).toBe(200)
    expect(response.body.error).toBe('')

    const result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      [newUser.username]
    )

    expect(result.rowCount).toBe(1)
    expect(response.body.id).toBe(result.rows[0].user_id)
  })

  it('should return 404 and error of user not found', async () => {
    const newUser = {
      username: '_test',
      password: 'password',
      email: 'temp@gmail.com'
    }

    const response = await request(app).get('/login').send(newUser)

    expect(response.statusCode).toBe(404)
    expect(response.body.error).toBe('User not found')
  })

  it('should not query for a user and return status 400 due to missing items', async () => {
    const newUser = {
      username: '_test',
      email: 'temp@gmail.com'
    }

    const response = await request(app).get('/login').send(newUser)

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Missing Username or Password')

    const newUser2 = {
      password: 'password',
      email: 'temp@gmail.com'
    }
  })
})
