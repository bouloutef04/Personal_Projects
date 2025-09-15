import React, { Fragment, useState, useEffect } from 'react'
import { data, useNavigate } from 'react-router-dom'
//import { set } from '../../../server/app'

const Dashboard = () => {
  const user_id = JSON.parse(localStorage.getItem('user_id'))
  const navigate = useNavigate()
  const [editingGameId, setEditingGameId] = useState(null)
  const [editedGameData, setEditedGameData] = useState({})
  const [addGameData, setAddGameData] = useState({})

  function logOut () {
    try {
      localStorage.setItem('user_id', 0)
      navigate('/')
    } catch (err) {
      console.log(err.message)
    }
  }

  function checkLogIn () {
    if (user_id === 0) {
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

      console.log('Sending to backend:', cleanedData)

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
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

  function openForm () {
    document.getElementById('add-game-form').style.display = 'block'
  }

  function closeForm () {
    const myForm = document.getElementById("game-addForm")
    
    myForm.reset();
    setAddGameData({})
    document.getElementById('add-game-form').style.display = 'none'
  }

  async function createGame () {
    try {
      const body = {
        game_name: addGameData.game_name,
        user_id: user_id,
        game_finished: addGameData.game_finished,
        game_totalAchievements: Number(addGameData.game_totalAchievements),
        game_achievementsEarned: Number(addGameData.game_achievementsEarned),
        game_image: '',
        game_playTime: Number(addGameData.game_playTime)
      }
      console.log(body)

      if (body.game_name === undefined) {
        document.getElementById('add_error').textContent = 'Err: Game Name Missing'
        return
      }
      if(body.game_finished === undefined)
        body.game_finished = false
      if(isNaN(body.game_totalAchievements)){
        body.game_totalAchievements = 0
      }
      
      if(isNaN(body.game_achievementsEarned)){
        body.game_achievementsEarned = 0
      }
      if(isNaN(body.game_playTime))
        body.game_playTime = 0

      console.log(body)

      const endpoint = 'http://localhost:5001/createGame'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Failed to create game', response.text)
      }
      // Refetch the games after deletion
      const updatedGames = await fetch('http://localhost:5001/getGames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id })
      })

      const data = await updatedGames.json()
      setGames(data.rows)
      setAddGameData({})
      closeForm()
    } catch (error) {
      console.error('Error creating game:', error.message)
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
                        game_playtime: Number(e.target.value)
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
          <tr>
            <td>
              <button className='add' onClick={openForm}>
                Add Game
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='add-game-popup' id='add-game-form'>
        <div id='add_error' className='add-error'>
          /Game/
        </div>
        <form id='game-addForm'
          onSubmit={e => {
            e.preventDefault()
            createGame()
          }}
        >
          <div className='add-div'>
            <label htmlFor='add_gamename'>Game Name</label>
            <input
              type='text'
              id='add_gamename'
              placeholder='Default Game'
              onChange={e =>
                setAddGameData({
                  ...addGameData,
                  game_name: e.target.value
                })
              }
            />
          </div>
          <div className='add-div'>
            <label htmlFor='gamefinished'>Game Finished</label>
            <select
              id='add_finishedDropdown'
              placeholder='false'
              onChange={e =>
                setAddGameData({
                  ...addGameData,
                  game_finished: e.target.value === 'true'
                })
              }
            >
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div className='add-div'>
            <label htmlFor='add_gametotalAchievements'>
              Total Achievements
            </label>
            <input
              type='number'
              id='add_gametotalAchievements'
              placeholder='0'
              min='0'
              max='2000'
              step='1'
              onChange={e =>
                setAddGameData({
                  ...addGameData,
                  game_totalAchievements: e.target.value
                })
              }
            />
          </div>
          <div className='add-div'>
            <label htmlFor='add_gameachievementsEarned'>
              Achievements Earned
            </label>
            <input
              type='number'
              id='add_gametotalAchievements'
              placeholder='0'
              min='0'
              max='2000'
              step='1'
              onChange={e =>
                setAddGameData({
                  ...addGameData,
                  game_achievementsEarned: e.target.value
                })
              }
            />
          </div>
          <div className='add-div'>
            <label htmlFor='add_gameplayTime'>Hours Played</label>
            <input
              type='number'
              id='add_gameplayTime'
              placeholder='0'
              min='0'
              max='1000000'
              step='5'
              onChange={e =>
                setAddGameData({
                  ...addGameData,
                  game_playTime: e.target.value
                })
              }
            />
          </div>
          <div className='add-div'>
            <button type='submit' className='add'>
              Add
            </button>
            <button type='button' className='delete' onClick={closeForm}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Dashboard
