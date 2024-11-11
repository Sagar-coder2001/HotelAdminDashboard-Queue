import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import LoginForm from './Pages/Loginpage/LoginForm'
import Admindashboard from './Pages/Dashboard/Admindashboard'

function App() {

  return (
    <>
    <div>
      <div className="app-container">
      <BrowserRouter>
      <Routes>
        <Route path = "/" element ={<LoginForm/>}/>
        <Route path = "/Admindashboard" element ={<Admindashboard/>}/>
      </Routes>
      </BrowserRouter>

    </div>
    </div>

    </>
  )
}

export default App
