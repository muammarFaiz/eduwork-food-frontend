import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AskLogin from "./askToLogin"

import ShowProfile from "./showProfile"

export default function Profile() {
  const [memory1, setMemory1] = useState({submitLoading: 'Submit',
    username: '', password: '',
    editMode: false,
    origin: {username: '', email: '', password: ''},
    emailV: '', passwordV: '',
    disableButton: false,
    successEdit: false
  })
  
// next sending the modified user

  useEffect(() => {
    axios({
      url: 'http://localhost:3001/auth/userdata',
      method: 'GET',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    }).then(result => result.data, err => console.log(err))
    .then(data => {
      if(data.status) {
        console.log(data);
      } else {
        setMemory1(prev => {
          return {
            ...prev, origin: { username: data.username, email: data.email, password: ''},
            username: data.username
          }
        })
      }
    }, errr => console.log(errr))
  }, [])

  const handleSubmit = val => {
    val.preventDefault()
    setMemory1(prev => {
      return {...prev, disableButton: true, submitLoading: 'Loading...'}
    })
    let tosend = {}
    if(!memory1.username && !memory1.password) {
      console.log('all empty...');
      setMemory1(prev => {
        return {...prev, disableButton: false, submitLoading: 'Submit', editMode: false, successEdit: ''}
      })
    } else {
      if(!memory1.username) {
        tosend.password = memory1.password
      } else if(!memory1.password) {
        tosend.username = memory1.username
      } else {
        tosend.username = memory1.username
        tosend.password = memory1.password
      }
      axios({
        url: 'http://localhost:3001/auth2/updateuser',
        method: 'POST',
        data: tosend,
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      .then(result => result.data, error => {
        setMemory1(prev => {
          return { ...prev, disableButton: false, submitLoading: 'Submit', editMode: false, successEdit: 'fail' }
        })
      })
      .then(data => {
        console.log(data);
        setMemory1(prev => {
        return { ...prev, disableButton: false, submitLoading: 'Submit', editMode: false, successEdit: 'success' }
        // add fail success warning
        })
      }, err => {
        console.log(err)
        setMemory1(prev => {
          return { ...prev, disableButton: false, submitLoading: 'Submit', editMode: false, successEdit: 'fail' }
        })
      })
    }
  }

  const inputControl = (name, value) => {
    if(!value) {
      // for input value...
      if(memory1.editMode === 'authorized') {
        return memory1[name]
      } else {
        return memory1.origin[name]
      }
    } else {
      // for input onchange...
      setMemory1(prev => {
        const clone = {...prev}
        clone[name] = value.target.value
        return clone
      })
    }
  }

  const toggleEdit = val => {
    setMemory1(prev => {
      if(prev.editMode === 'authorized') {
        // cancel edit
        return {...prev, editMode: false}
      } else {
        // try edit
        return {...prev, editMode: 'verify', successEdit: ''}
      }
    })
  }

  const userInterface = () => {
    if(memory1.editMode === 'verify' || memory1.editMode === 'rejected') {
      return AskLogin(handleSubmitVerify, inputControl, memory1)
    } else {
      return ShowProfile(toggleEdit, memory1, handleSubmit, inputControl)
    }
  }

  const handleSubmitVerify = val => {
    // request server to compare their jwt with their email and password
    val.preventDefault()
    setMemory1(prev => {
      return {...prev, submitLoading: 'Loading...'}
    })
    axios({
      url: 'http://localhost:3001/auth2/verify2',
      method: 'POST',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
      data: {
        email: memory1.emailV,
        password: memory1.passwordV
      }
    }).then(fulfil => fulfil.data, err => console.log(err))
    // .then(data => console.log(data), err => console.log(err))
    .then(data => {
      if(data.status === 'accepted') {
        console.log('user accepted');
        setMemory1(prev => {
          return {...prev, submitLoading: 'Submit', editMode: 'authorized', emailV: '', passwordV: ''}
        })
      } else {
        console.log('user rejected');
        setMemory1(prev => {
          return {...prev, submitLoading: 'Submit', editMode: 'rejected'}
        })
      }
    }, error => console.log(error.message))
  }


  return (
    <>
    <div className="navigationHeader">
      <div className="rightSide">
        <button><Link to={'/home'} className='routeLink'>Home</Link></button>
      </div>
      <div className="loginRegister">
        <button><Link to={'/cart'} className='routeLink'>Cart</Link></button>
        {/* <button>Log Out</button> */}
      </div>
    </div>

    <div className="registerWrapper">
      <div className="registerCard">
        <h1>{memory1.successEdit}</h1>
        {userInterface()}
        <p>{memory1.editUserStatus}</p>
      </div>
    </div>
    </>
  )
}