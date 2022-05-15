import { useState } from "react"
import { Link } from "react-router-dom"

import './invoiceCss.css'

export default function Invoice(props) {
  const [m, setm] = useState({
    alamat: props.topMemory.selectedAlamat,
    products: props.topMemory.toBuy
  })

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
      return (
        <div className="invoiceProdCard" key={i}>
          <div className="invoiceProdConf">
            <h3>Product Name: {obj.product.productName}</h3>
            <p>quantity: {obj.quantity}</p>
            <p>{obj.product.price}</p>
            <p>Total: {totalPrice(obj)}</p>
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