import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import './cartStyle.css'
import mege from './mege.png'

export default function Cart() {
  const [memory1, setMemory1] = useState({
    cart: [],
    cartLoading: false,
    saveButton: false
  })
  const initialUseEffect = useRef(0)

  useEffect(() => {
    initialUseEffect.current++
    if(initialUseEffect.current > 2) {
      setMemory1(prev => {
        return {...prev, saveButton: true}
      })
    }
  }, [memory1.cart])

  useEffect(() => {
    setMemory1(prev => {
      return { ...prev, cartLoading: true}
    })
    axios({
      url: 'http://localhost:3001/api/cart',
      method: 'GET',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    }).then(resu => resu.data, err => console.log(err))
    .then(data => {
      console.log(data);
      if (data.status === 'ok') {
        setMemory1(prev => {
          console.log(data.data.userCart);
          return {...prev, cart: data.data.userCart, cartLoading: false}
        })
      } else {
        setMemory1(prev => {
          return {...prev, cartLoading: false}
        })
      }
    }, err => console.log(err))
  }, [])

  const totalPrice = (prod) => {
    let priceInt = ''
    const strArr = prod.product.price.split('')
    strArr.forEach(str => {
      if(parseInt(str, 10) || parseInt(str, 10) === 0) {
        priceInt = priceInt + str
      }
    })
    priceInt = parseInt(priceInt, 10) * prod.quantity
    priceInt = priceInt.toString()
    let i = 0, reverseStr = ''
    while (i < priceInt.length) {
      const reverseIndex = (priceInt.length - 1) - i
      if((i + 1)%4 === 0) {
        reverseStr = (reverseStr + '.') + priceInt[reverseIndex]
      } else {
        reverseStr = reverseStr + priceInt[reverseIndex]
      }
      i++
    }
    // request server each modify or after user close the page and do bulk modify?
    let i2 = 0, reversed = ''
    while (i2 < reverseStr.length) {
      reversed = reversed + reverseStr[(reverseStr.length - 1) - i2]
      i2++
    }

    return reversed
  }

  const modq = (val, id) => {
    setMemory1(prev => {
      let modCart = [], clone = {...prev}
      modCart = prev.cart.map(obj => {
        if(obj._id === id) {
          if(val.target.innerText === '+') {
            obj.quantity = obj.quantity + 1
          } else {
            if(!(obj.quantity < 2)) {
              obj.quantity = obj.quantity - 1
            }
          }
          return obj
        } else {return obj}
      })
      clone.cart = modCart
      return clone
    })
  }

  const deleteMe = (val, id) => {
    setMemory1(prev => {
      const clone = {...prev}
      const newArr = prev.cart.filter(obj => {
        if(obj._id !== id) {
          return true
        }
      })
      clone.cart = newArr
      console.log(clone.cart);
      return clone
    })
  }

  const saveCart = () => {
    const tosend = memory1.cart.map(obj => {
      return {product: obj.product._id, quantity: obj.quantity}
    })
    axios({
      url: 'http://localhost:3001/api/cart',
      method: 'PUT',
      data: {newArr: tosend},
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    }).then(result => result.data, err => console.log(err))
    .then(data => {
      console.log(data)
    }, err => console.log(err))
  }

  const cartCard = () => {
    if(memory1.cart.length) {
      const cards = memory1.cart.map((prod, i) => {
        return (
          <div className="cartCard" key={i}>
            <h1>{prod.product.productName}</h1>
            <div className="productDetail">
                <img src={
                  `http://localhost:3001/images/${prod.product.image_url.split('/')[2]}`
                } alt={prod.product.productName} />
              <div>
                <div className="quantityButton">
                  <button onClick={val => modq(val, prod._id)}>-</button>
                  <span>{prod.quantity}</span>
                  <button onClick={val => modq(val, prod._id)}>+</button>
                </div>
                <p>{prod.product.price}</p>
                <p>{totalPrice(prod)}</p>
                <button onClick={val => deleteMe(val, prod._id)}>Delete</button>
              </div>
            </div>
          </div>
        )
      })
      return cards
    } else {
      return <h1>empty...</h1>
    }
  }

  return (
    <>
      <div className="navigationHeader">
        <div className="rightSide">
          <button><Link to={'/home'} className='routeLink'>Home</Link></button>
        </div>
        <div className="loginRegister">
          <button><Link to={'/profile'} className='routeLink'>Profile</Link></button>
          {/* <button>Log Out</button> */}
        </div>
      </div>

      <div className="cartWrapper">
        {cartCard()}
        {memory1.saveButton ? <button onClick={saveCart}>Save Changes</button> : ''}
      </div>
    </>
  )
}