import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const user_id = JSON.parse(localStorage.getItem('user_id'))
  const navigate = useNavigate()
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
        console.log("API response:", data);
        setGames(data.rows)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching games:', error)
        setLoading(false)
      })
  }, [])

  //   const getGames = async e => {
  //     //e.preventDefault()
  //     const body = { user_id }
  //     console.log(user_id)
  //     console.log(typeof user_id)

  //     try {
  //       const endpoint = 'http://localhost:5001/getGames'

  //     //   const response = await fetch(endpoint, {
  //     //     method: 'POST',
  //     //     headers: { 'Content-Type': 'application/json' },
  //     //     body: JSON.stringify(body)
  //     //   })
  //     //     .then(res => res.json())
  //     //     .then(data => {
  //     //       setGames(data.games)
  //     //     })
  //     // //   const data = await response.json()
  //     //   setGames(data)
  //     //   console.log(data)

  //     } catch (err) {
  //       console.error(err.message)
  //     }
  //   }
  //   getGames()

  return (
    <div>
      <h1 className='text-center mt-5'>Welcome to your Dashboard</h1>
      <p className='text-center mt-2'>Your user ID: {user_id}</p>
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
                  src={game.image_url || 'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png'}
                  alt={game.game_name}
                  width='100'
                />
              </td>
              <td>{game.game_name}</td>
              <td>{game.finished ? 'Yes' : 'No'}</td>
              <td>{game.game_totalachievements}</td>
              <td>{game.game_achievementsearned}</td>
              <td>{game.game_playtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
