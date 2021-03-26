import React, { useState } from 'react'
import M from 'materialize-css'

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [buttonLoaderSpan, setButtonLoaderSpan] = useState("Send Email")

    const forgotPassword = () => {

        const headers = { 'Content-Type': 'application/json' }

        const data = {
            email
        }

        const config = {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }
        setButtonLoaderSpan("Please wait...")
        fetch("/api/v1/auth/forgotPassword", config).then(res => res.json())
            .then(data => {
                if (data.status) {
                    setButtonLoaderSpan("Forgot Password")
                    M.toast({ html: data.message, classes: "green" })
                    setEmail("")
                }
                else {
                    setButtonLoaderSpan("Forgot Password")
                    M.toast({ html: data.message, classes: "red" })
                    setEmail("")
                }

            }).catch(err => {
                console.log(err)
                setButtonLoaderSpan("Forgot Password")
            })
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2 className="insta-logo">Forgot Password - Instagram</h2>
                <input type="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email" />
                <button onClick={forgotPassword} className="btn waves-effect waves-light blue darken-1">{buttonLoaderSpan}</button>
            </div>
        </div>
    )
}

export default ForgotPassword
