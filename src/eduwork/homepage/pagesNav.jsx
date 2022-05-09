import axios from "axios"
import { useEffect, useState } from "react"

const DOC_PER_PAGE = 10
const VISIBLE_BUTTONS_LIMIT = 2

export default function PageNav(props) {
  const [memory, setMemory] = useState({
    visiblePages_index: 0,
    totalPage: 0,
    visiblePages: [],
    activeButtonPage: 1,
    disableForward: false, disableBack: false
  })
  
  useEffect(() => {
    const totalPages = Math.ceil(props.totalDoc / DOC_PER_PAGE)
    let visiblePages = [], disableForward, disableBack
    if((props.totalDoc - DOC_PER_PAGE) <= 0) {
      visiblePages = [1]
      // console.log('less than one page');
      disableForward = disableBack = true
    } else {
      let totalButtonsToShow = totalPages >= VISIBLE_BUTTONS_LIMIT ? VISIBLE_BUTTONS_LIMIT : totalPages
      for (let i = 0; i < totalButtonsToShow; i++) {
        visiblePages = [...visiblePages, ((memory.visiblePages_index + 1) + i)]
      }
      if(totalPages <= VISIBLE_BUTTONS_LIMIT) {
        // console.log('total pages less or equal button limit');
        disableForward = disableBack = true
      } else {
        // console.log('total pages larger than button limit');
        if((memory.visiblePages_index + VISIBLE_BUTTONS_LIMIT) < totalPages) {disableForward = false}
        else {disableForward = true}
        if(memory.visiblePages_index > 0) {disableBack = false}
        else {disableBack = true}
      }
    }
    setMemory(prev => {
      return {...prev, totalPage: totalPages, visiblePages: visiblePages,
        disableForward: disableForward, disableBack: disableBack}
    })
  }, [memory.visiblePages_index, props.totalDoc, memory.activeButtonPage])

  const activeButtonStyle = (i) => {
    console.log(memory.activeButtonPage);
    if(i === memory.activeButtonPage) {return 'activePage'}
    else {return ''}
  }

  const goFoward = (pageButton, n) => {
    setMemory(prev => {
      if(pageButton) {

        axios({
          url: 'http://localhost:3001/index',
          method: 'GET',
          headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
          params: {
            category: props.memory1.toggleCategory.length !== 0 ?
              props.memory1.toggleCategory.map(str => str.toLowerCase()) : [],
            tag: props.memory1.toggleTags !== 0 ?
              props.memory1.toggleTags.map(str => str.toLowerCase()) : [],
            skip: (n - 1) * DOC_PER_PAGE,
            searchbar: props.memory1.searchbar
          }
        })
          .then(fulfil => fulfil.data, rej => console.log(rej))
          .then(data => {
            props.updateCards(data.result, data.total)
          }, err => console.log(err))
        if(prev.disableForward) {
          return {...prev, activeButtonPage: n}
        } else if(prev.visiblePages[prev.visiblePages.length - 1] === n) {
          console.log('this last element of the array...so move forward');
          return {...prev, visiblePages_index: prev.visiblePages_index + 1, activeButtonPage: n}
        } else {
          return {...prev, activeButtonPage: n}
        }
      } else if ((prev.totalPage - (prev.visiblePages[prev.visiblePages.length - 1])) <= 1) {
        console.log('last one page...so plus only 1');
        return {...prev, visiblePages_index: prev.visiblePages_index + 1}
      } else {
        console.log('plus two');
        return {...prev, visiblePages_index: prev.visiblePages_index + 2}
      }
    })
  }

  const goBack = () => {
    setMemory(prev => {
      if(memory.visiblePages_index < 2) {
        return {...prev, visiblePages_index: prev.visiblePages_index - 1}
      } else {
        return {...prev, visiblePages_index: prev.visiblePages_index - 2}
      }
    })
  }

  return (
    <div className='pagesButton'>
      <button disabled={memory.disableBack} onClick={goBack}>{"<"}</button>
      <div className='pagesNumber'>
        {memory.visiblePages.map((n, i) => {
          return (
            <button className={activeButtonStyle(n)} onClick={
              () => goFoward(true, n)
            } key={i}>{n}</button>
          )
        })}
      </div>
      { <button disabled={memory.disableForward} onClick={() => goFoward(false)}>{">"}</button>}
    </div>
  )
}