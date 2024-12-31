import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import LoginForm from './Pages/Loginpage/LoginForm'
import Admindashboard from './Pages/Dashboard/Admindashboard'
import Table_dashboard from './Pages/Table-Dashboard/Table_dashboard'
import Hotel_dashboard from './Pages/Hotel-Dashboard/Hotel_dashboard'
import Employee_dashboard from './Pages/Employee-dashboard/Employee_dashboard'
import { useSelector } from 'react-redux'
import UserProfile from './Pages/Userprofile/UserProfile'

function App() {

  const bgcolor = useSelector((state) => state.theme.value);
  const textcolors = useSelector((state) => state.theme.textcolor)
  document.body.style.backgroundColor = bgcolor;
  document.body.style.color = textcolors;

  return (
    <>
    <div>
      <div className="app-container">
      <BrowserRouter>
      <Routes>
        <Route path = "/" element ={<LoginForm/>}/>
        <Route path = "/Admindashboard" element ={<Admindashboard/>}/>
        <Route path = "/Table_dashboard" element ={<Table_dashboard/>}/>
        <Route path = "/Hotel_dashboard" element ={<Hotel_dashboard/>}/>
        <Route path = "/Employee_dashboard" element ={<Employee_dashboard/>}/>
        <Route path = "/Userprofile" element ={<UserProfile/>}/>

      </Routes>
      </BrowserRouter>

    </div>
    </div>

    </>
  )
}

export default App
