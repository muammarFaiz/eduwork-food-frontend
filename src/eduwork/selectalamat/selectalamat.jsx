import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './selectalamatCss.css'

export default function SelectAlamat(props) {
  const [m, setm] = useState({
    showdropdown: "scroll_div hide",
    selected: 'select your address',
    youneedtologin: false,
    addressArr: 'none',
    selectedObj: false
  })
  const navigate = useNavigate()

  useEffect(() => {
    axios({
      url: 'http://localhost:3001/api/address',
      method: 'GET',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(result => result.data, err => console.log(err))
    .then(data => {
      if(data.message === 'jwt malformed') {
        setm(prev => {return {...prev, youneedtologin: true}})

      } else if(data._id !== undefined) {

        console.log(data.addressArr);
        setm(prev => {return {...prev, addressArr: data.addressArr}})
      } else {
        alert('unkown error from the server')
      }
    }, err => console.log(err))
  }, [])

  const respond = (val) => {
    setm(prev => {
      if (val.target.attributes.class !== undefined) {
        if (val.target.attributes.class.value !== 'inputAddr') {
          return {...prev, showdropdown: "scroll_div hide"}
        } else {
          return {...prev, showdropdown: "scroll_div"}
        }
      } else {
        return {...prev, showdropdown: "scroll_div hide"}
      }
    })
  }

  const handleSelect = (val, obj) => {
    setm(prev => {
      return {...prev, selected: val.target.innerText, selectedObj: obj}
    })
    props.setMemory(prev => {
      return {...prev, selectedAlamat: obj}
    })

  }

  if(m.youneedtologin) {
    return <h1>you need to login</h1>
  } else {
    return (
      <>
        <div onClick={val => respond(val)}>
        <div className="navigationHeader">
          <div className="rightSide">
            <button><Link to={'/home'} className='routeLink'>Home</Link></button>
          </div>
          <div className="loginRegister">
            <button><Link to={'/profile'} className='routeLink'>Profile</Link></button>
            {/* <button>Log Out</button> */}
          </div>
        </div>
  
        <div className="scroll_bg">
        <input type="text" className='inputAddr' onFocus={
          val => respond(val)
        } value={m.selected} readOnly />
          <div className={m.showdropdown}>
            <div className="object_one" onClick={val => handleSelect(val)}>Lorem ipsum dolor sit.</div>
            {
              m.addressArr === 'none' ? <h1>unknown error, addressArr: 'none'</h1> :
              m.addressArr.length === 0 ? <h1>you don't have an address</h1> :
              m.addressArr.map((obj, i) => {
                return <div className="object_one" onClick={val => handleSelect(val, obj)} key={i}>{obj.title}</div>
              })
            }
          </div>
          {m.selectedObj ?
          <div>
            <h3>Title: {m.selectedObj.title}</h3>
            <h3>Provinsi: {m.selectedObj.provinsi}</h3>
            <h3>Kelurahan: {m.selectedObj.kelurahan}</h3>
            <h3>Kecamatan: {m.selectedObj.kecamatan}</h3>
            <h3>Kabupaten: {m.selectedObj.kabupaten}</h3>
            <h3>Detail: {m.selectedObj.detail}</h3>
          </div> : ''}
          {m.selected === 'select your address' ? '' : <button onClick={
              () => navigate('/confirmation')
          }>Continue</button>}
        </div>
      </div>
      </>
    )
  }
}
