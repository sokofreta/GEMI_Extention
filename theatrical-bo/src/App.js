
import { BusinessPortal } from "./components/businessPortal/BusinessPortal";
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import  Home from "./components/Pages/Home/Home"
import TestingRoutes from "./components/Pages/TestingRoutes/TestingRoutes";

function App() {
  return (
    
    <>
      <Router>
        <Routes>
          <Route index element={<TestingRoutes/>}/>
          
          <Route path="/Home" element={<Home/>}/>
          <Route path="/Scrapper" element={<BusinessPortal />}/>
          <Route path="/Bussineses" element={<h1>Bussineses</h1>}/>

        </Routes>
        
        
      </Router>
      </>
  );
}

export default App;