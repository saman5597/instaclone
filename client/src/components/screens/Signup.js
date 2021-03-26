import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

function Signup() {

    const history = useHistory()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const [signupLoaderSpan, setSignupLoaderSpan] = useState("Signup")

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const signUp = () => {

        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }

    }

    const uploadFields = () => {

        const headers = { 'Content-Type': 'application/json' }

        const data = {
            fullName,
            email,
            password,
            profilePic: url
        }

        const config = {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }
        setSignupLoaderSpan("Please wait...")
        fetch("/api/v1/auth/signup", config).then(res => res.json())
            .then(data => {
                if (data.status) {
                    setSignupLoaderSpan("Signup")
                    M.toast({ html: data.message, classes: "green" })
                    history.push('/login')
                }
                else {
                    setSignupLoaderSpan("Signup")
                    M.toast({ html: data.message, classes: "red" })
                    setFullName("")
                    setEmail("")
                    setPassword("")
                }

            }).catch(err => {
                console.log(err)
                setSignupLoaderSpan("Signup")
            })
    }

    const uploadPic = () => {

        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "saman5")

        fetch("https://api.cloudinary.com/v1_1/saman5/image/upload", {
            method: "POST",
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.secure_url)
            }).catch(err => console.log(err))
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2 className="insta-logo">Sign up for Instagram</h2>
                <input type="text" onChange={e => setFullName(e.target.value)} value={fullName} placeholder="Name" />
                <input type="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email" />
                <input type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Password" />
                <div className="file-field input-field">
                    <div className="btn blue darken-1">
                        <span>Upload Profile Image</span>
                        <input type="file" onChange={e => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button onClick={signUp} className="btn waves-effect waves-light blue darken-1">{signupLoaderSpan}</button>
                <h6><Link to="/login">Already have an account ?</Link></h6>
            </div>
        </div>
    )
}

export default Signup
