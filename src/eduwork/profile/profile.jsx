import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import './profileCss.css'

export default function Profile(props) {
  const [m, setm] = useState({
    origin: {username: '', password: '', email: ''},
    live: {username: '', password: ''},
    editButtonText: 'Edit'
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (props.topMemory.toEditProfile.allowed) {
      setm(prev => {
        return {...prev, editButtonText: 'Cancel'}
      })
    } else {
      setm(prev => {
        return {...prev, editButtonText: 'Edit', live: {username: prev.origin.username, password: prev.origin.password}}
      })
    }
  }, [props.topMemory.toEditProfile.allowed])

  useEffect(() => {
    axios({
      url: 'https://eduwork-foodserver.herokuapp.com/auth/userdata',
      method: 'GET',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(result => result.data, err => console.log(err))
      .then(data => {
        if (data.status) {
          console.log(data);
        } else {
          console.log(data);
          setm(prev => {
            return { ...prev, origin: { ...prev.origin, username: data.username, email: data.email}}
          })
        }
      }, err => console.log(err))
  }, [])

  useEffect(() => {
    setm(prev => {
      return {...prev, live: {username: prev.origin.username, password: prev.origin.password}}
    })
  }, [m.origin])

// *******************************************************************************************************
  const handleChange = value => {
    return val => {
      if (props.topMemory.toEditProfile.allowed) {
        setm(prev => {
          if(value === 'username') {
            return {...prev, live: {...prev.live, username: val.target.value}}
          } else {
            return {...prev, live: {...prev.live, password: val.target.value}}
          }
        })
      }
    }
  }

  const handleSubmit = val => {
    val.preventDefault()
    let tosend
    if(m.live.username === '') {
      tosend = {password: m.live.password}
    } else if(m.live.password === '') {
      tosend = {username: m.live.username}
    } else {
      tosend = {username: m.live.username, password: m.live.password}
    }
    axios({
      url: 'https://eduwork-foodserver.herokuapp.com/auth2/updateuser',
      method: 'POST',
      data: tosend,
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(result => result.data, error => console.log(error))
      .then(data => {
        console.log(data)
        if(data.status === 'ok') {
          setm(prev => {
            return {...prev, origin: {...prev.origin, username: data.username}}
          })
        }
      }, err => console.log(err))
  }

  const editButtonOnclick = val => {
    if (props.topMemory.toEditProfile.allowed) {
      props.setMemory(prev => {
        return {...prev, toEditProfile: {...prev.toEditProfile, allowed: false}}
      })
      // setm(prev => {
      //   return {...prev, origin: {...prev.origin, }}
      // })
    } else {
      navigate('/verifyuser')
    }
  }

  return (
    <div>
      <div className="navigationHeader">
        <div className="rightSide">
          <button><Link to={'/home'} className='routeLink'>Home</Link></button>
        </div>
        <div className="loginRegister">
          <button><Link to={'/cart'} className='routeLink'>Cart</Link></button>
          {/* <button>Log Out</button> */}
        </div>
      </div>

      <div className="userProfileWrapper">
        <button onClick={editButtonOnclick}>{m.editButtonText}</button>
        <button onClick={val => navigate('/alamat')}>Addresses</button>
        <button onClick={val => navigate('/orderlist')}>Orders</button>

        <p className="email_p">Email: {m.origin.email}</p>
        <form onSubmit={handleSubmit} className='profileForm1'>
          <input type="text" placeholder="Username" value={m.live.username}
            onChange={handleChange('username')}/>
          <input type="text" placeholder="Password" value={m.live.password}
            onChange={handleChange('password')}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}