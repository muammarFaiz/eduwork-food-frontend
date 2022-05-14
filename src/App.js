import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import Home from './eduwork/homepage/home'
import Register from './eduwork/register/register'
import Login from './eduwork/login/login'
// import Profile from './eduwork/userProfile/userProfile'
import Cart from './eduwork/cart/cartPage'
import Alamat from './eduwork/alamat/alamat'

import './App.css';
import { useState } from 'react';
import SelectAlamat from './eduwork/selectalamat/selectalamat'
import Confirmation from './eduwork/confirmation/confirmation'
import Invoice from './eduwork/invoice/invoice'
import OrderList from './eduwork/orderList/orderList'
import Profile from './eduwork/profile/profile'
import Verify from './eduwork/verifyuser/verifyuser'

function App() {
  const [memory2, setMemory2] = useState({
    loggedIn: false,
    toBuy: false,
    selectedAlamat: false,
    confirmedBuy: false,
    toEditProfile: {
      allowed: false,
      email: false
    }
  })

  const topMemoryEdit = (key, value) => {
    setMemory2(prev => {
      const clone = {...prev}
      clone[key] = value
      return clone
    })
  }

  useEffect(() => {
    console.log('authenticate useeffect ran...');
    if (localStorage.getItem('token')) {
      axios.get(`${process.env.SERVER_URL || 'http://localhost:3001'}/auth`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(fulfil => fulfil.data, err => {
          console.log('this error: ');
          console.log(err.message)
        })
        .then(data => {
          if (data.loggedIn) {
            setMemory2(prev => {
              return { ...prev, loggedIn: 'token accepted' }
            })
          } else {
            console.log(data);
            setMemory2(prev => {
              return { ...prev, loggedIn: 'token rejected' }
            })
          }
        }, err => {
          console.log('that error:');
          console.log(err.message)
        })
      } else {
        alert('no token found, need to login')
        setMemory2(prev => {
          return { ...prev, loggedIn: 'token rejected' }
        })
    }
  }, [])

  console.log({message: 'app render...', data: memory2});

  return (
    <BrowserRouter>
      {
        memory2.loggedIn ?
        <Routes>
            <Route path='/' element={
              <Home topMemoryEdit={topMemoryEdit} topMemory={memory2} setMemory2={setMemory2} />
            }/>
            <Route path='register' element={
              memory2.loggedIn === 'token accepted' ?
              <Navigate to={'/'} /> :
              <Register topMemoryEdit={topMemoryEdit} topMemory={memory2} />
            }/>
            <Route path='login' element={
              memory2.loggedIn === 'token accepted' ?
              <Navigate to={'/'} /> :
              <Login topMemoryEdit={topMemoryEdit} topMemory={memory2} />
            }/>
            <Route path='profile' element={
              memory2.loggedIn === 'token accepted' ?
              <Profile setMemory={setMemory2} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
            <Route path='cart' element={
              memory2.loggedIn === 'token accepted' ?
              <Cart topMemoryEdit={topMemoryEdit} setMemory={setMemory2} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
            <Route path='alamat' element={
              memory2.loggedIn === 'token accepted' ?
              <Alamat topMemoryEdit={topMemoryEdit} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
            <Route path='selectalamat' element={
            memory2.loggedIn === 'token accepted' ?
            <SelectAlamat setMemory={setMemory2} topMemory={memory2} /> :
            <Navigate to={'/'} />
          }/>
          <Route path='confirmation' element={
              memory2.loggedIn === 'token accepted' && memory2.selectedAlamat !== false ?
              <Confirmation setMemory={setMemory2} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
          <Route path='invoice' element={
              memory2.confirmedBuy ?
              <Invoice setMemory={setMemory2} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
          <Route path='orderlist' element={
              memory2.loggedIn === 'token accepted' ?
              <OrderList setMemory={setMemory2} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
          <Route path='verifyuser' element={
              memory2.loggedIn === 'token accepted' ?
              <Verify setMemory={setMemory2} topMemory={memory2} /> :
              <Navigate to={'/'} />
            }/>
          <Route path='*' element={
              <Navigate to={'/'} />
            }/>
        </Routes> :
        <h1>Loading...</h1>
      }
    </BrowserRouter>
  );
}

export default App;
