import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineArrowDropDown } from "react-icons/md";
import './selectalamatCss.css'

const cg = console.log

export default function SelectAlamat(props) {
  const [m, setm] = useState({
    showdropdown: "scroll_div hide",
    selected: 'select your address',
    youneedtologin: false,
    addressArr: 'none',
    selectedObj: false
  })
  const navigate = useNavigate()
  const dropdown_node = useRef(null)

  useEffect(() => {
    axios({
      url: 'https://eduwork-foodserver.herokuapp.com/api/address',
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

  useEffect(() => {
    console.log(m.showdropdown);
  }, [m.showdropdown])

  const respond = (val) => {
    console.log('the func run');
    console.log(dropdown_node.current);
    console.log(val.target);
    console.log(dropdown_node.current.contains(val.target));
    if (dropdown_node.current.contains(val.target)) {
      console.log('clicked....');
      setm(prev => {
        if (prev.showdropdown === 'scroll_div hide') {
          return {...prev, showdropdown: 'scroll_div'}
        } else {
          return {...prev, showdropdown: 'scroll_div hide'}
        }
      })
    } else {
      setm(prev => {
        return { ...prev, showdropdown: 'scroll_div hide'}
      })
    }
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
        <div 
          onClick={val => respond(val)}
        className='addrSelectPageGround'>
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
            <div className="selectAddrButton"
              ref={ref => {dropdown_node.current = ref}}
            >
              <p>{m.selected}</p>
              <MdOutlineArrowDropDown size={30} />
            </div>
              <div className={m.showdropdown}>
                {
                  m.addressArr === 'none' ? <h1>you don't have any address registered</h1> :
                  m.addressArr.length === 0 ? <h1>you don't have any address registered</h1> :
                  m.addressArr.map((obj, i) => {
                    return <div className="object_one" onClick={
                      val => handleSelect(val, obj)
                    } key={i}>{obj.title}</div>
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
