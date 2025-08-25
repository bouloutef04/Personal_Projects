import React, { useState } from 'react'

const Signup_Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [formMode, setFormMode] = useState('login') // or 'signup'

  const handleSubmit = async e => {
    e.preventDefault()

    const body = { username, password, email }

    try {
      const endpoint =
        formMode === 'login' ? 'http://localhost:5001/login' : 'http://localhost:5001/signup'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <>
      <h1 className='text-center mt-5'>Game Progress Tracker Login</h1>
      <form
        className='d-flex mt-2 flex-column justify-content-center'
        onSubmit={handleSubmit}
      >
        <label htmlFor='username'>Username: </label>
        <input
          type='text'
          id='usernameInput'
          name='usernameInput'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor='password'>Password: </label>
        <input
          type='password'
          id='passwordInput'
          name='passwordInput'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor='email'>Email: </label>
        <input
          type='email'
          id='emailInput'
          name='emailInput'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className='d-flex mt-4 justify-content-center'>
          <button
            type='submit'
            className='btn btn-success flex-fill'
            onClick={() => setFormMode('login')}
          >
            Login
          </button>
          <button
            type='submit'
            className='btn bg-info flex-fill'
            onClick={() => setFormMode('signup')}
          >
            Signup
          </button>
        </div>
      </form>
    </>
  )
}

export default Signup_Login;