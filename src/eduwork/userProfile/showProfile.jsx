import { useNavigate } from "react-router-dom"


export default function ShowProfile(memory1, handleSubmit, inputControl) {

const navigate = useNavigate()

  return (
    <>
      {/* <button onClick={toggleEdit}>{memory1.editMode === 'authorized' ? 'Cancel' : 'Edit Profile'}</button> */}
      <button onClick={val => navigate('/alamat')}>Daftar Alamat</button>
      <button onClick={val => navigate('/orderlist')}>Daftar Order</button>
      <form onSubmit={handleSubmit}>
        <p>{memory1.origin.email}</p>
        <label htmlFor="username">Username:</label>
        <input type="text" placeholder="username" name="username" id="username"
          onChange={val => inputControl('username', val)} value={inputControl('username')} />
        <label htmlFor="password">Password:</label>
        <input type="password" placeholder="password" name="password" id="password"
          onChange={val => inputControl('password', val)} value={inputControl('password')} />
        {
          memory1.editMode === 'authorized' ?
            <button disabled={memory1.disableButton} type="submit">{memory1.submitLoading}</button> : ''
        }
      </form>
    </>
  )
}