import { useNavigate } from "react-router-dom";


const initialReq = (axios, setMemory1) => {
  console.log('use effect home is ran...');

  axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/categories`)
    .then(fulfil => fulfil.data, rej => console.log(rej))
    .then(fulfilData => {
      setMemory1(prev => {
        return { ...prev, categories: fulfilData }
      })
    })
  axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/tags`)
    .then(fulfil => fulfil.data, rej => console.log(rej))
    .then(fulfilData => {
      setMemory1(prev => {
        return { ...prev, tags: fulfilData }
      })
    })
}

const toggleButton1 = (setMemory1, searchbarRef) => {
  return (val) => {
    setMemory1(prev => {
      return {...prev, searchbar: searchbarRef.current}
    })
    const bgColor = val.target.style
    if (bgColor.color === 'black') {
      bgColor.color = ''
      bgColor.borderRadius = ''
      bgColor.border = ''
      setMemory1(prev => {
        const clone = { ...prev }
        // if tag button clicked...
        if (val.target.parentElement.attributes.class.value === 'tagsDiv') {
          if (prev.toggleTags.includes(val.target.innerText)) {
            const newArr = prev.toggleTags.filter(str => str !== val.target.innerText)
            clone.toggleTags = newArr
            return clone
          } else { return clone }
        } else {
          if (prev.toggleCategory.includes(val.target.innerText)) {
            const newArr = prev.toggleCategory.filter(str => str !== val.target.innerText)
            clone.toggleCategory = newArr
            return clone
          } else { return clone }
        }
      })
    } else {
      bgColor.color = 'black'
      bgColor.borderRadius = '5px'
      bgColor.border = 'solid 1px green'
      setMemory1(prev => {
        let clone = { ...prev }
        // if tag button clicked...
        if (val.target.parentElement.attributes.class.value === 'tagsDiv') {
          if (prev.toggleTags.includes(val.target.innerText)) { return { ...prev } }
          else {
            clone.toggleTags = [...prev.toggleTags, val.target.innerText]
            return clone
          }
        } else {
          if (prev.toggleCategory.includes(val.target.innerText)) { return { ...prev } }
          else {
            clone.toggleCategory = [...prev.toggleCategory, val.target.innerText]
            return clone
          }
        }
      })
    }
  }
}

const cardFilter = (cardData, card) => {
  return () => {
    const final = cardData.length === 0 ? <h1>Zero result</h1> : cardData.map((obj, i) => card(obj, i))
    return final
  }
}

const card1 = (addToCart, memory1, navigate, setMemory2) => {
  const buyFromHomePage = (cardObj) => {
    const tosave = {
      _id: 'from homepage',
      product: cardObj,
      quantity: 1
    }
    console.log(tosave);
    setMemory2(prev => {
      return {...prev, toBuy: tosave}
    })

  }
  return (obj, i) => {
    return (
      <div className='product__card' key={i}>
        <h1>{obj.productName}</h1>
        <img src={`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/images/${obj.image_url.split('/')[obj.image_url.split('/').length - 1]
          }`} alt={obj.image_url.split('/')[obj.image_url.split('/').length - 1]} />
        <div className='cardDetails'>
          <p>category: {obj.category.name}</p>
          <p>tag: {obj.tag.map(obj => obj.name).join(', ')}</p>
          <p>{obj.price}</p>
        </div>
        <div>
          <button onClick={() => addToCart(obj._id)} disabled={memory1.addCartLoading}>{
            memory1.addCartLoading ? 'Loading...' : 'Add To Cart'
          }</button>
          <button onClick={val => buyFromHomePage(obj)}>Buy</button>
        </div>
      </div>
    )
  }
}


const submitSearch1 = (setMemory1, searchbarRef) => {
  return () => {
    setMemory1(prev => {
      return { ...prev, searchbar: searchbarRef.current }
    })
  }
}

const dropdownHandle = (memory1, setMemory1) => {
  return (val) => {
    if (memory1.dropdownCategory) {
      setMemory1(prev => {
        return { ...prev, dropdownCategory: '' }
      })
    } else {
      setMemory1(prev => {
        return { ...prev, dropdownCategory: 'active' }
      })
    }
  }
}

const detectClick1 = (setMemory1, memory1) => {
  return val => {
    const area = val.target.parentElement.attributes.class
    if ((!area || (area.value !== 'dropdownCategory' && area.value !== 'dropdownCategory_content active')) && memory1.dropdownCategory) {
      setMemory1(prev => {
        return { ...prev, dropdownCategory: '' }
      })
    }
  }
}

export default initialReq
export {
  toggleButton1,
  cardFilter,
  card1,
  submitSearch1,
  dropdownHandle,
  detectClick1
}