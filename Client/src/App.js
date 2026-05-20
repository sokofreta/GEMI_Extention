
import { BusinessPortal } from "./components/businessPortal/BusinessPortal";
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import  Home from "./components/Pages/Home/Home"
import Business from "./components/Pages/Business/Businesses"
import LoginPage from "./components/Pages/Login/Login";
import RegisterPage from "./components/Pages/Register/Register";

function App() {
  return (
    
    <>
      <Router>
        <Routes>
          
          <Route index element={<Home/>}/>
          <Route path="/Scrapper" element={<BusinessPortal />}/>
          <Route path="/Bussineses" element={<Business/>}/>

          <Route path="/Register" element= {<RegisterPage/>}/>
          <Route path="/Login" element={<LoginPage/>}/>

        </Routes>
        
        
      </Router>
      </>
  );
}

export default App;