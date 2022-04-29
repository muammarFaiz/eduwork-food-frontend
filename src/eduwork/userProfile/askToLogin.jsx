

export default function AskLogin(handleSubmitVerify, inputControl, memory1) {
  return (
    <div className="registerWrapper">
      <h1 className="warningInfo">{
        memory1.editMode === 'rejected' ? 'wrong email or password' : 'enter email and password'
      }</h1>
      <div className="registerCard">
        <form onSubmit={handleSubmitVerify}>
          <input type="email" placeholder="email" name="email"
            onChange={val => inputControl('emailV', val)} value={memory1.emailV} />
          <input type="password" placeholder="password" name="password"
            onChange={val => inputControl('passwordV', val)} value={memory1.passwordV} />
          <button type="submit">{memory1.submitLoading}</button>
        </form>
      </div>
    </div>
  )
}