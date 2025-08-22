const app = require('../app');
const request = require('supertest');
const pool = require('../db');
// module.exports = handler;
// const express = require('express');

describe('POST /signup', () => {
  beforeAll(async () => {
    // Clean up test user if exists
    await pool.query('DELETE FROM Users WHERE user_username = $1', ['_test']);
  });

  afterAll(async () => {
    // Close db connection to exit tests cleanly
    await pool.end();
  });

  it('should create a new user and return status 200 with user id', async () => {
    const newUser = {
      username: '_test',
      password: 'password',
      email: 'temp@gmail.com',
    };

    const response = await request(app).post('/signup').send(newUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe('');

    // Optionally verify user exists in DB:
    const result = await pool.query(
      'SELECT user_id FROM Users WHERE user_username = $1',
      [newUser.username]
    );
    expect(result.rowCount).toBe(1);
    expect(response.body.id).toBe(result.rows[0].user_id);
  });
});
