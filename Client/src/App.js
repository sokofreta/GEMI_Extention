
import { BusinessPortal } from "./components/businessPortal/BusinessPortal";
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import  Home from "./components/Pages/Home/Home"
import Business from "./components/Pages/Business/Businesses"
import LoginPage from "./components/Pages/Login/Login";
import RegisterPage from "./components/Pages/Register/Register";
import UserProfile from "./components/Pages/UserProfile/UserProfile";

function App() {
  return (
    
    <>
      <Router>
        <Routes>
          
          <Route index element={<Home/>}/>
          <Route path="/Scrapper" element={<BusinessPortal />}/>
          <Route path="/Bussineses" element={<Business/>}/>
          <Route path="/Profile" element={<UserProfile/>}/>


          <Route path="/Register" element= {<RegisterPage/>}/>
          <Route path="/Login" element={<LoginPage/>}/>

        </Routes>
        
        
      </Router>
      </>
  );
}

export default App;