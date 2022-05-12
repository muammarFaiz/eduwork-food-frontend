import { useState } from "react"
import { Link } from "react-router-dom"

import './invoiceCss.css'

export default function Invoice(props) {
  const [m, setm] = useState({
    alamat: props.topMemory.selectedAlamat,
    products: props.topMemory.toBuy
  })

  const totalPrice = (prod) => {
    let priceInt = ''
    const strArr = prod.product.price.split('')
    strArr.forEach(str => {
      if (parseInt(str, 10) || parseInt(str, 10) === 0) {
        priceInt = priceInt + str
      }
    })
    priceInt = parseInt(priceInt, 10) * prod.quantity
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
      return (
        <div className="invoiceProdCard" key={i}>
          <div className="invoiceProdConf">
            <h3>Product Name: {obj.product.productName}</h3>
            <p>quantity: {obj.quantity}</p>
            <p>{obj.product.price}</p>
            <p>Total: Rp. {totalPrice(obj)}</p>
          </div>
        </div>
      )
    })
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

      <h1>Invoice: </h1>
      <div className="invoiceCard">
        <div className="invoiceProdList">
          {productCard()}
        </div>
        <div className="invoiceAlamatCard">
          <h3>Alamat: </h3>
          <p>{m.alamat.title}</p>
          <p>Kelurahan: {m.alamat.kelurahan}</p>
          <p>Kecamatan: {m.alamat.kecamatan}</p>
          <p>Kabupaten: {m.alamat.kabupaten}</p>
          <p>Provinsi: {m.alamat.provinsi}</p>
          <p>Detail: {m.alamat.detail}</p>
        </div>
      </div>
    </div>
  )
}