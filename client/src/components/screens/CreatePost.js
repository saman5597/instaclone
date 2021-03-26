import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import cookie from 'react-cookie'

function CreatePost() {

    const history = useHistory()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [buttonLoaderSpan, setButtonLoaderSpan] = useState("Submit Post")

    const uploadPost = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "saman5")

        setButtonLoaderSpan("Please wait...")
        fetch("https://api.cloudinary.com/v1_1/saman5/image/upload", {
            method: "POST",
            body: data
        }).then(res => res.json())
            .then(data => {
                const token = cookie.load('jwt')

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }

                const postData = {
                    title,
                    body,
                    imageUrl: data.secure_url
                }

                const config = {
                    method: "POST",
                    headers,
                    body: JSON.stringify(postData)
                }

                fetch("/api/v1/posts", config).then(res => res.json())
                    .then(response => {

                        if (response.status) {
                            setButtonLoaderSpan("Submit Post")
                            M.toast({ html: response.message, classes: "green" })
                            history.push('/')
                        }
                        else {
                            setButtonLoaderSpan("Submit Post")
                            M.toast({ html: response.message, classes: "red" })
                            setTitle("")
                            setBody("")
                            setImage("")
                        }
                    }).catch(err => {
                        console.log(err)
                        setButtonLoaderSpan("Submit Post")
                    })
            }).catch(err => {
                console.log(err)
                setButtonLoaderSpan("Submit Post")
            })


    }

    return (
        <div className="card input-field create-post">
            <input type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Title" />
            <input type="text" onChange={e => setBody(e.target.value)} value={body} placeholder="Post body" />
            <div className="file-field input-field">
                <div className="btn blue darken-1">
                    <span>Upload image</span>
                    <input type="file" onChange={e => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button onClick={uploadPost} className="btn waves-effect waves-light blue darken-1">{buttonLoaderSpan}</button>
        </div>
    )
}

export default CreatePost
