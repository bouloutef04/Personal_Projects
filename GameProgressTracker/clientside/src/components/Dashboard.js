import React, { Fragment, useState, useEffect } from 'react'
import { data, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const user_id = JSON.parse(localStorage.getItem('user_id'))
  const navigate = useNavigate()
  const [editingGameId, setEditingGameId] = useState(null)
  const [editedGameData, setEditedGameData] = useState({})

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

  const saveEdit = async game_id => {
    try {
      const endpoint = 'http://localhost:5001/updateGame' // Adjust if needed

      const cleanedData = {
      game_image: '',
      user_id: user_id,
      game_id,
      game_name: editedGameData.game_name,
      game_finished: editedGameData.game_finished,
      game_totalachievements: Number(editedGameData.game_totalachievements),
      game_achievementsearned: Number(editedGameData.game_achievementsearned),
      game_playtime: Number(editedGameData.game_playtime) // Ensure it's a number
    }

    console.log('Sending to backend:', cleanedData);

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          cleanedData
        )
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `Failed to update game. Status: ${response.status}, Message: ${errorText}`
        )
        throw new Error('Failed to update game: ', response.json)
      }

      // Optionally refetch or update local state
      setGames(prevGames =>
        prevGames.map(game =>
          game.game_id === game_id ? { ...game, ...editedGameData } : game
        )
      )

      setEditingGameId(null) // Exit edit mode
    } catch (error) {
      console.error('Error updating game:', error.message)
    }
  }

  async function deleteGame (game_id) {
    try {
      const body = { game_id }
      const endpoint = 'http://localhost:5001/deleteGame'

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Failed to delete game')
      }

      // Refetch the games after deletion
      const updatedGames = await fetch('http://localhost:5001/getGames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id })
      })

      const data = await updatedGames.json()
      setGames(data.rows)
    } catch (error) {
      console.error('Error deleting game:', error.message)
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
            <tr key={game.game_id}>
              <td>
                <img
                  src={game.image_url || 'https://...'}
                  alt={game.game_name}
                  width='100'
                />
              </td>

              <td>
                {editingGameId === game.game_id ? (
                  <input
                    type='text'
                    value={editedGameData.game_name || ''}
                    onChange={e =>
                      setEditedGameData({
                        ...editedGameData,
                        game_name: e.target.value
                      })
                    }
                  />
                ) : (
                  game.game_name
                )}
              </td>

              <td>
                {editingGameId === game.game_id ? (
                  <select
                    value={editedGameData.game_finished ?? false}
                    onChange={e =>
                      setEditedGameData({
                        ...editedGameData,
                        game_finished: e.target.value === 'true'
                      })
                    }
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                ) : game.game_finished ? (
                  'Yes'
                ) : (
                  'No'
                )}
              </td>

              <td>
                {editingGameId === game.game_id ? (
                  <input
                    type='number'
                    value={editedGameData.game_totalachievements || 0}
                    onChange={e =>
                      setEditedGameData({
                        ...editedGameData,
                        game_totalachievements: e.target.value
                      })
                    }
                  />
                ) : (
                  game.game_totalachievements
                )}
              </td>

              <td>
                {editingGameId === game.game_id ? (
                  <input
                    type='number'
                    value={editedGameData.game_achievementsearned || 0}
                    onChange={e =>
                      setEditedGameData({
                        ...editedGameData,
                        game_achievementsearned: e.target.value
                      })
                    }
                  />
                ) : (
                  game.game_achievementsearned
                )}
              </td>

              <td>
                {editingGameId === game.game_id ? (
                  <input
                    type='number'
                    value={editedGameData.game_playtime || 0}
                    onChange={e =>
                      setEditedGameData({
                        ...editedGameData,
                        game_playtime:Number( e.target.value)
                      })
                    }
                  />
                ) : (
                  game.game_playtime
                )}
              </td>
              <td>
                {editingGameId === game.game_id ? (
                  <>
                    <button onClick={() => saveEdit(game.game_id)}>Save</button>
                    <button onClick={() => setEditingGameId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className='edit'
                    onClick={() => {
                      setEditingGameId(game.game_id)
                      setEditedGameData({ ...game })
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
              <td>
                <button
                  className='delete'
                  name={game.game_id}
                  onClick={() => deleteGame(game.game_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <td>
            <button
              className='add'>
                Add Game 
              </button>
          </td>
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
