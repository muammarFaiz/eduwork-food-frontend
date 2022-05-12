import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import './orderListCss.css'

export default function OrderList(props) {
  const [m, setm] = useState({
    userAddrList: 'loading',
    orderAddressArr: 'loading',
    prodData: 'loading'
  })

  useEffect(() => {
    if(m.orderAddressArr === 'fail') {
      setm(prev => {
        return {...prev, prodData: 'fail'}
      })
    } else if(m.orderAddressArr !== 'loading') {
      let promiseArr = []
      m.orderAddressArr.forEach(dest => {
        dest.orderList.forEach(ord => {
          const promi = axios({
            url: 'http://localhost:3001/api/products/findbyid',
            method: 'POST',
            headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
            data: {
              productId: ord.product,
              address: dest.destination,
              quantity: ord.quantity
            }
          }).then(fulfil => fulfil.data, err => console.log(err))
          promiseArr.push(promi)
        });
      });
      let values
      Promise.all(promiseArr).then(res => {
        console.log(res);
        values = res
        setm(prev => {
          return {...prev, prodData: values}
        })
      })
    }
  }, [m.orderAddressArr])
  
  useEffect(() => {
    console.log('prodData: ');
    console.log(m.prodData);
  }, [m.prodData])
  
  useEffect(() => {
    axios({
      url: 'http://localhost:3001/api/address',
      method: 'GET',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(fulfil => fulfil.data, err => console.log(err))
    .then(data => {
      // console.log(data.addressArr)
        setm(prev => {return {...prev, userAddrList: data.addressArr}})
      }, err => console.log(err))
      
      axios({
      url: 'http://localhost:3001/api/order',
      method: 'GET',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(fulfil => fulfil.data, err => console.log(err))
    .then(data => {
      if(data === 'not found') {
        setm(prev => {
          return { ...prev, orderAddressArr: 'fail'}
        })
      } else {
        setm(prev => {
          // console.log(data.destinationList);
          return { ...prev, orderAddressArr: data.destinationList}
        })
      }
    }, err => console.log(err))
  }, [])

  const addrCard = (filtered) => {
    if(filtered === null) {
      return (
        <div className="orderAddrCard">
          <p>address not found in your account...</p>
        </div>
      )
    } else {
      return (
        <div className="orderAddrCard">
          <h1>Alamat: </h1>
          <p>title: {filtered.title}</p>
          <p>kelurahan: {filtered.kelurahan}</p>
        </div>
      )
    }
  }

  const totalPrice = (priceStr, quantity) => {
    let priceInt = ''
    const strArr = priceStr.split('')
    strArr.forEach(str => {
      if (parseInt(str, 10) || parseInt(str, 10) === 0) {
        priceInt = priceInt + str
      }
    })
    priceInt = parseInt(priceInt, 10) * quantity
    priceInt = priceInt.toString()
    let i = 0, reverseStr = ''
    while (i < priceInt.length) {
      const reverseIndex = (priceInt.length - 1) - i
      if ((i + 1) % 4 === 0) {
        reverseStr = (reverseStr + '.') + priceInt[reverseIndex]
      } else {
        reverseStr = reverseStr + priceInt[reverseIndex]
      }
      i++
    }

    let i2 = 0, reversed = ''
    while (i2 < reverseStr.length) {
      reversed = reversed + reverseStr[(reverseStr.length - 1) - i2]
      i2++
    }

    return reversed
  }

  const orderCard = (thisAddr) => {
    return (
      <div className="orderCardsWrapper">
        {
          m.prodData === 'loading' ?
          <h1>Loading...</h1> :
          m.prodData.map((obj, i) => {
            if(obj.destination === thisAddr.destination) {
              return (
                <div className="orderCardInner" key={i}>
                  <img src={`http://localhost:3001/images/${obj.data.image_url.split('/')[obj.data.image_url.split('/').length - 1]
                    }`} alt={obj.data.image_url.split('/')[obj.data.image_url.split('/').length - 1]} />
                  <div className="orderCardDetail">
                    <h3>{obj.data.productName}</h3>
                    <p>{obj.data.price}</p>
                    <p>Quantity: {obj.quantity}</p>
                    <p>Total price: {totalPrice(obj.data.price, obj.quantity)}</p>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  const eachAddr = () => {
    return (
      m.orderAddressArr.map((obj, i) => {
        const filtered = m.userAddrList.find(userAddr => userAddr._id === obj.destination)
        return <div className="eachAddr" key={i}>
          {addrCard(filtered)}
          {orderCard(obj, )}
        </div>
      })
    )
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

      <div className="orderCardsWrapper">
        {
          m.orderAddressArr === 'loading' ?
          <h1>Loading...</h1> :
          m.orderAddressArr === 'fail' ?
          <h1>You don't have any order</h1> :
          eachAddr()
        }
      </div>
    </div>
  )
}