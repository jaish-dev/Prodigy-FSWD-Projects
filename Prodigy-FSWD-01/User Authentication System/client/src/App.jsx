
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login'; // You imported it but didn't use it — consider adding or removing
import Home from './Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Signup" />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
         <Route
          path="/Home"
          element={
            <Home /> 
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;