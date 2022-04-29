

const initialReq = (axios, setCardData, setMemory1) => {
  console.log('use effect home is ran...');
  axios.get('http://localhost:3001/index')
    .then(ful => ful.data, rej => console.log(rej))
    .then(fulData => {
      setCardData(fulData)
    })
  axios.get('http://localhost:3001/categories')
    .then(fulfil => fulfil.data, rej => console.log(rej))
    .then(fulfilData => {
      setMemory1(prev => {
        return { ...prev, categories: fulfilData }
      })
    })
  axios.get('http://localhost:3001/tags')
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
      return { ...prev, searchbar: searchbarRef.current }
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
            const tagIndex = prev.toggleTags.indexOf(val.target.innerText)
            clone.toggleTags.splice(tagIndex, 1)
            return clone
          } else { return clone }
        } else {
          if (prev.toggleCategory.includes(val.target.innerText)) {
            const categoryIndex = prev.toggleCategory.indexOf(val.target.innerText)
            clone.toggleCategory.splice(categoryIndex, 1)
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

const cardFilter = (cardData, memory1, card) => {
  return () => {
    const phase1 = cardData.filter((obj, i) => {
      const catString = obj.category.name
      if (memory1.toggleCategory.length == 0) {
        return obj
      } else {
        if (memory1.toggleCategory.includes(catString.charAt(0).toUpperCase() + catString.slice(1))) {
          console.log('a product included');
          return obj
        }
      }
    })
    const phase2 = phase1.filter((obj, i) => {
      const tagArray = obj.tag
      if (memory1.toggleTags.length == 0) {
        return true
      } else {
        let accepted = false
        tagArray.forEach(tagObj => {
          if (memory1.toggleTags.includes(tagObj.name.charAt(0).toUpperCase() + tagObj.name.slice(1))) {
            accepted = true
          }
        });
        return accepted
      }
    })
    const phase3 = phase2.filter((obj, i) => {
      const productName = obj.productName
      if (memory1.searchbar == '') {
        return true
      } else {
        const re = RegExp(memory1.searchbar, 'i')
        if (productName.match(re)) {
          return true
        }
      }
    })
    const final = phase3.map((obj, i) => card(obj, i))
    return final
  }
}

const card1 = () => {
  return (obj, i) => {
    return (
      <div className='product__card' key={i}>
        <h1>{obj.productName}</h1>
        <img src={`http://localhost:3001/images/${obj.image_url.split('/')[obj.image_url.split('/').length - 1]
          }`} alt="" />
        <div className='cardDetails'>
          <p>category: {obj.category.name}</p>
          <p>tag: {obj.tag.map(obj => obj.name).join(', ')}</p>
          <p>{obj.price}</p>
        </div>
        <div>
          <button>Add to cart</button>
          <button>Buy</button>
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
    let toggle
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