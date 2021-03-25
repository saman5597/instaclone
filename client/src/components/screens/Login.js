import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import cookie from 'react-cookie'
import { UserContext } from '../../App'

function Login() {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginLoaderSpan, setLoginLoaderSpan] = useState("Login")

    const login = () => {

        const headers = { 'Content-Type': 'application/json' }

        const data = {
            email,
            password
        }

        const config = {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }
        setLoginLoaderSpan("Please wait...")
        fetch("/api/v1/auth/login", config).then(res => res.json())
            .then(data => {
                if (data.status) {
                    const token = cookie.load('jwt')
                    dispatch({ type: "USER", payload: data.user })
                    setLoginLoaderSpan("Login")
                    M.toast({ html: data.message, classes: "green" })
                    history.push('/')
                }
                else {
                    setLoginLoaderSpan("Login")
                    M.toast({ html: data.message, classes: "red" })
                    setEmail("")
                    setPassword("")
                }

            }).catch(err => {
                console.log(err)
                setLoginLoaderSpan("Please wait...")
            })
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2 className="insta-logo">Log in to your Instagram</h2>
                <input type="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email" />
                <input type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Password" />
                <button onClick={login} className="btn waves-effect waves-light blue darken-1">{loginLoaderSpan}</button>
                <h6><Link to="/signup">Don't have an account ?</Link></h6>
            </div>
        </div>
    )
}

export default Login
