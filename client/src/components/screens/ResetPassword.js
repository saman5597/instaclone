import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import M from 'materialize-css'

function ResetPassword() {
    const history = useHistory()
    const { resetToken } = useParams()
    const [password, setPassword] = useState("")
    const [buttonLoaderSpan, setButtonLoaderSpan] = useState("Reset Password")

    const resetPassword = () => {

        const headers = { 'Content-Type': 'application/json' }

        const data = {
            password
        }

        const config = {
            method: "PATCH",
            headers,
            body: JSON.stringify(data)
        }
        setButtonLoaderSpan("Please wait...")
        fetch(`/api/v1/auth/resetPassword/${resetToken}`, config).then(res => res.json())
            .then(data => {
                if (data.status) {
                    setButtonLoaderSpan("Reset Password")
                    M.toast({ html: data.message, classes: "green" })
                    history.push('/')
                }
                else {
                    setButtonLoaderSpan("Reset Password")
                    M.toast({ html: data.message, classes: "red" })
                    setPassword("")
                }

            }).catch(err => {
                console.log(err)
                setButtonLoaderSpan("Reset Password")
            })
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2 className="insta-logo">Reset Password - Instagram</h2>
                <input type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="New Password" />
                <button onClick={resetPassword} className="btn waves-effect waves-light blue darken-1">{buttonLoaderSpan}</button>
            </div>
        </div>
    )
}

export default ResetPassword
