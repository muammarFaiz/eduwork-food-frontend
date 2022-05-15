import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import './confirmationCss.css'

export default function Confirmation(props) {
  const [m, setm] = useState({
    alamat: props.topMemory.selectedAlamat,
    products: props.topMemory.toBuy
  })
  const navigate = useNavigate()

  const totalPrice = (prod) => {
    if (prod.product.price.match(/,/gi)) {
      console.log('internal error, price cannot contain comma');
    }
    const priceInt = parseInt(prod.product.price.replace(/[a-z]|\./gi, ''), 10)
    const totalPriceInt = priceInt * prod.quantity
    const priceStr = `Rp. ${totalPriceInt.toLocaleString('id')}`
    return priceStr
  }

  const productCard = () => {
    const tobuy = m.products
    console.log(tobuy);
    let tobuyArr
    if (Array.isArray(tobuy)) {
      tobuyArr = [...tobuy]
    } else {
      tobuyArr = [tobuy]
    }

    return tobuyArr.map((obj, i) => {
      const imageName = obj.product.image_url.split('/')[obj.product.image_url.split('/').length - 1]
      return (
          <div className="confirmProductCard" key={i}>
            <img src={`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/images/${imageName}`} alt={imageName} />
            <div className="productInfoConfirmation">
              <h3>Product Name: {obj.product.productName}</h3>
              <h3>quantity: {obj.quantity}</h3>
              <h3>{obj.product.price}</h3>
              <h3>Total: {totalPrice(obj)}</h3>
            </div>
          </div>
      )
    })
  }

  const saveOrder = val => {
    let prodArr
    if(Array.isArray(m.products)) {prodArr = m.products}
    else {prodArr = [m.products]}
    console.log({ order: prodArr, destinationId: m.alamat._id });
    axios({
      url: `${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/order`,
      method: 'POST',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
      data: {order: prodArr, destinationId: m.alamat._id}
    }).then(res => res.data, err => console.log(err))
    .then(data => {
      console.log(data);
      if(data.status === 'success') {
        props.setMemory(prev => {
          return {...prev, confirmedBuy: true}
        })
      } else {alert('something wrong from server')}
    }, err => console.log(err))
  }

  useEffect(() => {
    if(props.topMemory.confirmedBuy) {
      navigate('/invoice')
    }
  }, [props.topMemory.confirmedBuy])

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
    <div className="confirmationPage">

      {productCard()}
      <div className="confirmationAlamatCard">
        <h3>Alamat: </h3>
        <p>{m.alamat.title}</p>
        <p>Kelurahan: {m.alamat.kelurahan}</p>
        <p>Kecamatan: {m.alamat.kecamatan}</p>
        <p>Kabupaten: {m.alamat.kabupaten}</p>
        <p>Provinsi: {m.alamat.provinsi}</p>
        <p>Detail: {m.alamat.detail}</p>
      </div>
      <button onClick={saveOrder}>Confirm</button>
    </div>
    </>
  )
}