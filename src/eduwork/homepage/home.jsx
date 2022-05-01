import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import initialReq, { card1, cardFilter, detectClick1, dropdownHandle, submitSearch1, toggleButton1 } from './homePageUtils'


export default function Home(props) {
  const [cardData, setCardData] = useState('')
  const [memory1, setMemory1] = useState({
    categories: [],
    tags: [],
    dropdownCategory: '',
    toggleCategory: [],
    toggleTags: [],
    searchbar: '',
    logoutLoading: false,
    addCartLoading: false
  })
  const searchbarRef = useRef()

  useEffect(() => initialReq(axios, setCardData, setMemory1), [])

  const toggleButton = toggleButton1(setMemory1, searchbarRef)

  const detectClick = detectClick1(setMemory1, memory1)

  const addToCart = (id) => {
    setMemory1(prev => {
      return {...prev, addCartLoading: 'Loading...'}
    })
    axios({
      url: 'http://localhost:3001/api/cart',
      method: 'POST',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
      data: {product: id}
    }).then(result => result.data, err => console.log(err))
    .then(data => {
      console.log(data);
      setMemory1(prev => {
        return { ...prev, addCartLoading: false }
      })
    }, err => console.log(err))
  }
  const card = card1(addToCart, memory1)

  const dropdownHandler = dropdownHandle(memory1, setMemory1)

  const cardToShow = cardFilter(cardData, memory1, card)

  const submitSearch = submitSearch1(setMemory1, searchbarRef)


  const logoutUser = () => {
    setMemory1(prev => {
      return {...prev, logoutLoading: true}
    })
    axios.get('http://localhost:3001/auth/logout', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(fulfil => fulfil.data, err => console.log(err.message))
    .then(data => {
      if(data.status === 'token removed') {
        localStorage.removeItem('token')
        alert('logged out')
        setMemory1(prev => {
          return { ...prev, logoutLoading: false }
        })
        props.topMemoryEdit('loggedIn', 'token rejected')
      } else {
        console.log(data);
        setMemory1(prev => {
          return { ...prev, logoutLoading: false }
        })
      }
    }, error => console.log({status: 'error 2', data: error}))
  } // check if this logout user works properly

  const ifLoggedIn = () => {
    if(props.topMemory.loggedIn === 'token accepted') {
      return (
        <div className='loginRegister'>
          <button><Link to={'/cart'} className='routeLink'>Cart</Link></button>
          <button><Link to={'/profile'} className='routeLink'>Profile</Link></button>
          <button onClick={logoutUser}>Logout</button>
        </div>
      )
    } else {
      return (
        <div className='loginRegister'>
          <button><Link to={'/login'} className='routeLink'>Login</Link></button>
          <button><Link to={'/register'} className='routeLink'>Register</Link></button>
        </div>
      )
    }
  }

  return (
    <div onClick={detectClick}>
      <h1>{props.topMemory.loggedIn}</h1>
      <div className='navigationHeader'>
        <div className='rightSide'>
          <button>Home</button>
          <div className='dropdownCategory'>
            <button onClick={dropdownHandler}>Category</button>
            <div className={`dropdownCategory_content ${memory1.dropdownCategory}`}>
              {
                memory1.categories.length !== 0 ?
                  memory1.categories.map((obj, i) => {
                    return (
                      <button onClick={toggleButton} key={i}>
                        {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
                      </button>
                    )
                  }) :
                  <button>
                    Loading...
                  </button>
              }
            </div>
          </div>
        </div>
        <div className='searchbar'>
          <input onChange={val => {searchbarRef.current = val.target.value}} type="text" />
          <button onClick={submitSearch}>Search</button>
        </div>
        {ifLoggedIn()}
      </div>
      <div className='tagsDiv'>
        tags:
        {
          memory1.tags.length !== 0 ?
            memory1.tags.map((obj, i) => {
              return (
                <button onClick={toggleButton} key={i}>
                  {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
                </button>
              )
            }) :
            <button>
              Loading...
            </button>
        }
        {memory1.logoutLoading ? <h1>Loading...</h1> : ''}
      </div>

      <div className='card__container'>
        {cardData ?
         cardToShow() :
        <h1>Loading...</h1>}
      </div>
    </div>
  )
}
