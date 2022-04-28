import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom"
import './loginStyle.css'

export default function Login() {
  const [memory1, setMemory1] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = val => {
    val.preventDefault()
    axios.post('http://localhost:3001/auth/login', {
      email: memory1.email,
      password: memory1.password
    })
    .then(result => result.data, err => console.log(err.message))
    .then(result => {
      console.log(result);
    }, err => console.log('error second then'))
  }
// login success but how i save the jwt token for the user?
  const inputControl = (name, val) => {
    setMemory1(prev => {
      const clone = {...prev}
      clone[name] = val.target.value
      return clone
    })
  }
  
  return (
    <div>
      <div className="navigationHeader">
        <div className="rightSide">
          <button>Home</button>
        </div>
        <div className="loginRegister">
          <button><Link to={'register'} className='routeLink'>Register</Link></button>
        </div>
      </div>

      <div className="registerWrapper">
        <div className="registerCard">
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" name="email"
              onChange={val => inputControl('email', val)} value={memory1.email} />
            <input type="password" placeholder="password" name="password"
              onChange={val => inputControl('password', val)} value={memory1.password} />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}