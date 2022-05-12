import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import AlamatCard from "./alamatCard"
import './alamatStyle.css'

export default function Alamat() {
const [memory, setMemory] = useState({
  data: [],
  now: {},
  editmode: false,
  editbutton: 'Edit',
  addNew: false
})

  useEffect(() => {
    axios({
      url: 'http://localhost:3001/api/address',
      method: 'GET',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    }).then(result => result.data, err => console.log(err))
    .then(data => {
      console.log(data)
      setMemory(prev => {
        const clone = {...prev}
        if(!data.err) {
          clone.data = data.addressArr
          clone.now = data.addressArr[0]
        } else {
          const x = {
            "title": 'Empty',
            "kelurahan": "",
            "kecamatan": "",
            "kabupaten": "",
            "provinsi": "",
            "detail": "you don't have any address registered here"
          }
          clone.data = [x]
          clone.now = x
        }
        return clone
      })
    }, err => console.log(err))
  }, [])

  const inputControl = (manage, name, val) => {
    if(manage === 'value') {
      return memory.now[name]
    } else {
      if(memory.editmode) {
        setMemory(prev => {
          return {...prev, now: {...prev.now, [name]: val.target.value}}
        })
      }
    }
  }

  const editmode = (reset) => {
    setMemory(prev =>{
      if(reset === 'reset') {
        const currentCard = prev.data.find(obj => obj._id === prev.now._id)
       return {...prev, editmode: false, editbutton: 'Edit', now: currentCard} 
      } else if(reset === 'delete') {
        axios({
          url: 'http://localhost:3001/api/address',
          method: 'DELETE',
          headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
          data: {id: memory.now._id}
        }).then(result => result.data, err => console.log(err))
        .then(data => {
          setMemory(prev => {
            if(data.status === 'success') {
              return {...prev, data: data.data.addressArr, now: data.data.addressArr[0]}
            } else {return prev}
          })
        }, err => console.log(err))
        return prev
      } else if(prev.editmode) {
        return {...prev, editmode: false, editbutton: 'Edit'}
      } else {
        return {...prev, editmode: true, editbutton: 'Batal'}
      }
    })
  }

  const formHandler = val => {
    val.preventDefault()
  }

  const toAdd = val => {
    setMemory(prev => {
      if(!prev.addNew) {
        return {...prev, addNew: true, editmode: true, editbutton: 'Batal'}
      } else {
        return prev
      }
    })
  }

  const handleSave = () => {
    let isEmpty = false
    Object.values(memory.now).forEach(str => {
      if(!str) {
        isEmpty = true
      }
    });
    let method, tosend
    if(memory.addNew) {
      method = 'POST'
      const {_id, ...tosend2} = memory.now
      tosend = tosend2
    } else {
      method = 'PUT'
      tosend = memory.data.map(obj => {
        if (obj._id === memory.now._id) {
          return memory.now
        } else { return obj}
      })
      console.log(tosend);
    }
    if(!isEmpty) {
      console.log('axios is sending...');
      axios({
        url: 'http://localhost:3001/api/address',
        method: method,
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
        data: {newAddress: tosend}
      }).then(result => result.data, err => console.log(err))
      .then(data => {
        console.log(data)
        console.log(data.data.addressArr)
        setMemory(prev => {
          return {...prev, data: data.data.addressArr, now: data.data.addressArr[0]}
        })
      }, err => console.log(err))
    } else {
      alert('all input must not be empty')
    }
  }

  const modCard = (id) => {
    setMemory(prev => {
      const clone = {...prev}
      const nowObj = prev.data.find(obj => obj._id === id)
      clone.now = nowObj
      return {...clone, editmode: false, editbutton: 'Edit', addNew: false}
    })
  }
  const activeButton = (id) => {
  if(memory.now._id !== id) {
    return ''
  } else {
    return 'thisActive'
  }
  }
  const disableDel = () => {
    if(memory.data.length < 2) {return true} else {return false}
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

    <div className="alamatWrapper">
      <div className="alamatList">
        <button onClick={toAdd}>Alamat Baru</button>
        {
          memory.data.map((obj, i) => {
            return (
              <button className={`addressTitle trex ${activeButton(obj._id)}`} onClick={
                () => modCard(obj._id)} key={i}>{obj.title
              }</button>
            )
          })
        }
      </div>
      <AlamatCard inputControl={inputControl} editmode={editmode} memory={memory}
        formHandler={formHandler} handleSave={handleSave} disableDel={disableDel} />
    </div>
    </>
  )
}