import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

import './verifyUserCss.css'

export default function Verify(props) {
  const [m, setm] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    axios({
      url: 'http://localhost:3001/auth/userdata',
      method: 'GET',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(result => result.data, err => console.log(err))
      .then(data => {
        if (data.status) {
          console.log(data);
        } else {
          console.log(data);
          setm(prev => {
            return { ...prev, email: data.email }
          })
        }
      }, err => console.log(err))
  }, [])

  const handleChange1 = value => {
    return val => {
      setm(prev => {
        if(value === 'email') {
          return {...prev, email: val.target.value}
        } else {
          return {...prev, password: val.target.value}
        }
      })
    }
  }

  const handleSubmit = val => {
    val.preventDefault()
    axios({
      url: 'http://localhost:3001/auth2/verify2',
      method: 'POST',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      data: {
        email: m.email,
        password: m.password
      }
    }).then(fulfil => fulfil.data, err => console.log(err))
      .then(data => {
        if (data.status === 'accepted') {
          console.log('user accepted');
          props.setMemory(prev => {
            return {...prev, toEditProfile: {...prev.toEditProfile, allowed: true}}
          })
          navigate('/profile')
        } else {
          console.log('user rejected');
          alert('wrong email or password')
        }
      }, error => console.log(error.message))
  }

  return (
    <div>
      <div className="navigationHeader">
        <div className="rightSide">
          <button><Link to={'/home'} className='routeLink'>Home</Link></button>
        </div>
        <div className="loginRegister">
          <button><Link to={'/profile'} className='routeLink'>Profile</Link></button>
          {/* <button>Log Out</button> */}
        </div>
      </div>

      <div className="verifyUser">
        <h2>Enter your old password:</h2>
        <form onSubmit={handleSubmit} className='verifyForm'>
          {/* <input type="text" placeholder="email" value={m.email} onChange={handleChange1('email')}/> */}
          <input type="text" placeholder="password" value={m.password} onChange={handleChange1('password')}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}