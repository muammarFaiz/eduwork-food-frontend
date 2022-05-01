

export default function ShowProfile(toggleEdit, memory1, handleSubmit, inputControl) {
  return (
    <>
      <button onClick={toggleEdit}>{memory1.editMode === 'authorized' ? 'Cancel' : 'Edit'}</button>
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