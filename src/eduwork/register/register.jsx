import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import './registerStyle.css'
import { useState } from "react"

export default function Register() {
    const [sending, setSending] = useState('Submit')
    const [input, setInput] = useState({username: '', email: '', password: '', confirmPass: ''})
    const navigate = useNavigate()

    const send = val => {
        val.preventDefault()
        if(input.password === input.confirmPass) {
            axios.post('http://localhost:3001/auth/register', {
                data: {
                    username: val.target[0].value,
                    email: val.target[1].value,
                    password: val.target[2].value,
                    role: 'user'
                }})
            .then(result => {
                console.log(result);
                return result.data
            }, err => console.log(err.message))
            .then(result => {
                if(result) {
                    if(result.success) {
                        alert('success, redirecting to login...')
                        setSending('success')
                        navigate('/')
                    } else {
                        console.log(result);
                        setSending(result.message)
                    }
                } else {
                    console.log('something is wrong, result undefined');
                    setSending('unknown error')
                }
            }, reject => {
                console.log(reject);
                setSending('failed...Unknown...')
            })
        } else {
            alert('password does not match')
            setSending('Submit')
        }
    }

    const inputManage = (from, val) => {
        setInput(prev => {
            const clone = {...prev}
            clone[from] = val.target.value
            return clone
        })
    }
    // ***************************************** navigate to login and check the server login
    return (
        <div>
            <div className="navigationHeader">
                <div className="rightSide">
                    <button>Home</button>
                </div>
                <div className="loginRegister">
                    <button><Link to={'login'} className='routeLink'>Login</Link></button>
                </div>
            </div>
            <div className="registerWrapper">
                <div className="registerCard">
                    <form onSubmit={send}>
                        <input name="username" type="text" placeholder="username" 
                        onChange={val => inputManage('username', val)} value={input.username} />
                        <input name="email" type="email" placeholder="email" 
                        onChange={val => inputManage('email', val)} value={input.email} />
                        <input name="password" type="password" placeholder="password" 
                        onChange={val => inputManage('password', val)} value={input.password} />
                        <input name="confirmPass" type="password" placeholder="confirm password" 
                        onChange={val => inputManage('confirmPass', val)} value={input.confirmPass} />
                        <button type="submit" onClick={val => setSending('Loading...')}>{sending}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}