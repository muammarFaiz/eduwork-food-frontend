import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export default function Login(props) {
  const [memory1, setMemory1] = useState({
    email: '',
    password: '',
    loginLoading: 'Submit',
    loginStatus: ''

  })
  const navigate = useNavigate()

  const handleSubmit = val => {
    val.preventDefault()
    setMemory1(prev => {
      return {...prev, loginLoading: 'Loading'}
    })
    axios.post('http://localhost:3001/auth/login', {
      email: memory1.email,
      password: memory1.password
    })
    .then(result => result.data, err => console.log(err.message))
    .then(result => {
      if(result.message === 'wrong email or password') {
        setMemory1(prev => {
          return {...prev, loginStatus: 'wrong email or password', loginLoading: 'Submit'}
        })
      } else {
        console.log(result);
        localStorage.setItem('token', result.user.token[result.user.token.length - 1])
        props.topMemoryEdit('loggedIn', 'token accepted')
        navigate('/')
      }
    }, err => console.log('error second then'))
  }

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
          <button><Link to={'/home'} className='routeLink'>Home</Link></button>
        </div>
        <div className="loginRegister">
          <button><Link to={'/register'} className='routeLink'>Register</Link></button>
        </div>
      </div>

      <div className="registerWrapper">
        {memory1.loginStatus ? <h1>{memory1.loginStatus}</h1> : ''}
        <div className="registerCard">
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" name="email"
              onChange={val => inputControl('email', val)} value={memory1.email} />
            <input type="password" placeholder="password" name="password"
              onChange={val => inputControl('password', val)} value={memory1.password} />
            <button type="submit">{memory1.loginLoading}</button>
          </form>
        </div>
      </div>
    </div>
  )
}