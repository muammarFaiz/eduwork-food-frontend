import { useState } from "react"
import { Link } from "react-router-dom"

import './confirmationCss.css'

export default function Confirmation(props) {
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
    // return <h1>hhe test</h1>

    return tobuyArr.map((obj, i) => {
      const imageName = obj.product.image_url.split('/')[obj.product.image_url.split('/').length - 1]
      return (
          <div className="confirmProductCard" key={i}>
            <img src={`http://localhost:3001/images/${imageName}`} alt={imageName} />
            <div className="productInfoConfirmation">
              <h3>Product Name: {obj.product.productName}</h3>
              <h3>quantity: {obj.quantity}</h3>
              <h3>{obj.product.price}</h3>
              <h3>Total: Rp. {totalPrice(obj)}</h3>
            </div>
          </div>
      )
    })
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
      <button>Confirm</button>
    </div>
    </>
  )
}