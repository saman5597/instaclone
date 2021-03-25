import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import cookie from 'react-cookie'

function EditProfile() {

    const history = useHistory()

    const [fullName, setFullName] = useState("")

    const editProfile = () => {

        const token = cookie.load('jwt')

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const config = {
            method: "PUT",
            headers,
            body: JSON.stringify({ fullName })
        }

        fetch("/api/v1/users/editProfile", config).then(res => res.json())
            .then(response => {

                if (response.status) {
                    M.toast({ html: response.message, classes: "green" })
                    history.push('/profile')
                }
                else {
                    M.toast({ html: response.message, classes: "red" })
                    setFullName("")
                }
            }).catch(err => {
                console.log(err)
                M.toast({ html: err.message, classes: "red" })
            })


    }

    return (
        <div className="card input-field create-post">
            <input type="text" onChange={e => setFullName(e.target.value)} value={fullName} placeholder="Name" />
            <button onClick={editProfile} className="btn waves-effect waves-light blue darken-1">Edit Profile</button>
        </div>
    )
}

export default EditProfile
