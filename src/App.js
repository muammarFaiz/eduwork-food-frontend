import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './eduwork/homepage/home'
import Register from './eduwork/register/register'
import Login from './eduwork/login/login'

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='register' element={<Register/>}/>
        <Route path='login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
