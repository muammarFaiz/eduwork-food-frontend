import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import mydata from '../../data'
import ax from './homepageUtils'

export default function Home() {
  const [cardData, setCardData] = useState('')
  const [memory1, setMemory1] = useState({
    categories: [],
    tags: [],
    dropdownCategory: '',
    toggleCategory: [],
    toggleTags: [],
    searchbar: ''
  })
  const searchbarRef = useRef()

  useEffect(() => {
    console.log('use effect is ran...');
    axios.get('http://localhost:3001/index')
    .then(ful => ful.data, rej => console.log(rej))
    .then(fulData => {
      console.log(fulData);
      setCardData(fulData)
    })
    axios.get('http://localhost:3001/categories')
    .then(fulfil => fulfil.data, rej => console.log(rej))
    .then(fulfilData => {
      console.log(fulfilData);
      setMemory1(prev => {
        return {...prev, categories: fulfilData}
      })
    })
    axios.get('http://localhost:3001/tags')
    .then(fulfil => fulfil.data, rej => console.log(rej))
    .then(fulfilData => {
      console.log(fulfilData);
      setMemory1(prev => {
        return {...prev, tags: fulfilData}
      })
    })
  }, [])
  console.log('re-render');

  const toggleButton = (val) => {
    const bgColor = val.target.style
    if(bgColor.color === 'black') {
      bgColor.color = ''
      bgColor.borderRadius = ''
      bgColor.border = ''
      setMemory1(prev => {
        const clone = {...prev}
        if (val.target.parentElement.attributes.class.value === 'tagsDiv') {
          if (prev.toggleTags.includes(val.target.innerText)) {
            const tagIndex = prev.toggleTags.indexOf(val.target.innerText)
            clone.toggleTags.splice(tagIndex, 1)
            return clone
          } else {return clone}
        } else {
          if(prev.toggleCategory.includes(val.target.innerText)) {
            const categoryIndex = prev.toggleCategory.indexOf(val.target.innerText)
            clone.toggleCategory.splice(categoryIndex, 1)
            return clone
          } else {return clone}
        }
      })
    } else {
      bgColor.color = 'black'
      bgColor.borderRadius = '5px'
      bgColor.border = 'solid 1px green'
      setMemory1(prev => {
        let clone = {...prev}
        if(val.target.parentElement.attributes.class.value === 'tagsDiv') {
          if(prev.toggleTags.includes(val.target.innerText)) {return {...prev}}
          else {
            clone.toggleTags = [...prev.toggleTags, val.target.innerText]
            return clone
          }
        } else {
          if(prev.toggleCategory.includes(val.target.innerText)) {return {...prev}}
          else {
            clone.toggleCategory = [...prev.toggleCategory, val.target.innerText]
            return clone
          }
        }
      })
    }
  }

  const detectClick = val => {
    let toggle
    const area = val.target.parentElement.attributes.class
    if ((!area || (area.value !== 'dropdownCategory' && area.value !== 'dropdownCategory_content active')) && memory1.dropdownCategory) {
      setMemory1(prev => {
        return {...prev, dropdownCategory: ''}
      })
    }
  }

  const card = (obj, i) => {
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

  const dropdownHandler = (val) => {
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

  const cardToShow = () => {
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
        if(productName.match(re)) {
          return true
        }
      }
    })
    console.log(phase3);
    const final = phase3.map((obj, i) => card(obj, i))
    return final
  }

  const submitSearch = () => {
    setMemory1(prev => {
      return {...prev, searchbar: searchbarRef.current}
    })
  }

// do request to server only when first render and selecting category, we can filter using searchbar and tags
  return (
    <div onClick={detectClick}>
      <div className='navigationHeader'>
        <div className='rightSide'>
          <button>Home</button>
          <div className='dropdownCategory'>
            <button onClick={dropdownHandler}>Category</button>
            <div className={`dropdownCategory_content ${memory1.dropdownCategory}`}>
              {
                memory1.categories.length !== 0 ?
                  memory1.categories.map((obj, i) => {
                    return (
                      <button onClick={toggleButton} key={i}>
                        {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
                      </button>
                    )
                  }) :
                  <button>
                    Loading...
                  </button>
              }
            </div>
          </div>
        </div>
        <div className='searchbar'>
          <input onChange={val => {searchbarRef.current = val.target.value}} type="text" />
          <button onClick={submitSearch}>Search</button>
        </div>
        <div className='loginRegister'>
          <button><Link to={'login'} className='routeLink'>Login</Link></button>
          <button><Link to={'register'} className='routeLink'>Register</Link></button>
        </div>
      </div>
      <div className='tagsDiv'>
        tags:
        {
          memory1.tags.length !== 0 ?
            memory1.tags.map((obj, i) => {
              return (
                <button onClick={toggleButton} key={i}>
                  {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
                </button>
              )
            }) :
            <button>
              Loading...
            </button>
        }
      </div>

      <div className='card__container'>
        {cardData ?
         cardToShow() :
        <h1>Loading...</h1>}
      </div>
    </div>
  )
}
