import React , { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const user_id = localStorage.getItem('user_id')

  return (
    <h1> HI</h1>
      /* <h1>Welcome to your Dashboard</h1>
      <p>Your user ID: {user_id}</p> */
    
  )
}

export default Dashboard
