import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const user_id = JSON.parse(localStorage.getItem('user_id'))
  const navigate = useNavigate()

  function logOut () {
    try {
      localStorage.setItem('user_id', 0)
      navigate('/')
    } catch (err) {
      console.log(err.message)
    }
  }

  function checkLogIn () {
    if (user_id == 0) {
      console.log('User is not logged in')
      navigate('/')
    }
  }
  checkLogIn()

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const body = { user_id }
    const endpoint = 'http://localhost:5001/getGames'

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data)
        setGames(data.rows)
        setLoading(false)
      })
      .catch(error => {
        console.log('Error fetching games:', error)
        setLoading(false)
      })
  }, [])

async function deleteGame(game_id) {
  try {
    const body = { game_id };
    const endpoint = 'http://localhost:5001/deleteGame';

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to delete game');
    }

    // Refetch the games after deletion
    const updatedGames = await fetch('http://localhost:5001/getGames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id }),
    });

    const data = await updatedGames.json();
    setGames(data.rows);
  } catch (error) {
    console.error('Error deleting game:', error.message);
  }
}


  return (
    <div>
      <h1 className='text-center mt-5'>Welcome to your Dashboard</h1>
      <p className='text-center mt-2'>Your user ID: {user_id}</p>
      <button className='logout' onClick={logOut}>
        Log-Out
      </button>
      <table>
        <thead>
          <tr>
            <th>Game Image</th>
            <th>Game Name</th>
            <th>Finished?</th>
            <th>Total Achievements</th>
            <th>Achievements Earned</th>
            <th>Play Time: Hours</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index}>
              <td>
                <img
                  src={
                    game.image_url ||
                    'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png'
                  }
                  alt={game.game_name}
                  width='100'
                />
              </td>
              <td>{game.game_name}</td>
              <td>{game.finished ? 'Yes' : 'No'}</td>
              <td>{game.game_totalachievements}</td>
              <td>{game.game_achievementsearned}</td>
              <td>{game.game_playtime}</td>
              <button className='edit' name={index}>
                Edit
              </button>
              <button
                className='delete'
                name={index}
                onClick={() => deleteGame(game.game_id)}
              >
                Delete
              </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
