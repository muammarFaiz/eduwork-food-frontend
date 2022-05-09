

import './alamatStyle.css'

export default function AlamatCard(props) {
  if(props.memory.data.length === 0) {
    return <h1>Loading...</h1>
  } else {
    return (
      <div className="alamatCard">
        <form action="" onSubmit={props.formHandler}>
          {
            props.memory.addNew ?
            <><label htmlFor="title">Title:</label>
            <input type="text" onChange={
              val => props.inputControl('input', 'title', val)
            } value={props.inputControl('value', 'title')} id='title' required /></> :
            <div>
              <button onClick={props.editmode}>{props.memory.editbutton}</button>
              <button onClick={() => props.editmode('reset')}>Reset</button>
              <button onClick={() => props.editmode('delete')} disabled={props.disableDel()}>Delete</button>
            </div>
          }
          
          <label htmlFor="kelurahan">Kelurahan:</label>
          <input type="text" onChange={
            val => props.inputControl('input', 'kelurahan', val)
          } value={props.inputControl('value', 'kelurahan')} id='kelurahan' required />
          <label htmlFor="kecamatan">Kecamatan:</label>
          <input type="text" onChange={
            val => props.inputControl('input', 'kecamatan', val)
          } value={props.inputControl('value', 'kecamatan')} id='kecamatan' required />
          <label htmlFor="kabupaten">Kabupaten:</label>
          <input type="text" onChange={
            val => props.inputControl('input', 'kabupaten', val)
          } value={props.inputControl('value', 'kabupaten')} id='kabupaten' required />
          <label htmlFor="provinsi">Provinsi:</label>
          <input type="text" onChange={
            val => props.inputControl('input', 'provinsi', val)
          } value={props.inputControl('value', 'provinsi')} id='provinsi' required />
          <label htmlFor="detail">Detail:</label>
          <textarea type="text" onChange={
            val => props.inputControl('input', 'detail', val)
          } value={props.inputControl('value', 'detail')} id='detail' required />
          <button onClick={props.handleSave} disabled={!props.memory.editmode}>Save</button>
        </form>
      </div>
    )
  }
}