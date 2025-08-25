import './App.css'
import { Fragment } from 'react/jsx-runtime'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupLogin from './components/SignupLogin'
import Dashboard from './components/Dashboard'

function App () {
  return (
    // <Fragment>
    //   <div className='container'>
    //     <SignupLogin />
    //   </div>
    // </Fragment>
    <Router>
      <Routes>
        <Route path='/' element={<SignupLogin />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
