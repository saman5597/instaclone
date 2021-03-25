import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
import cookie from 'react-cookie'

function Profile() {

    const { state, dispatch } = useContext(UserContext)
    const [myPosts, setMyPosts] = useState([])
    const [myProfile, setMyProfile] = useState({})
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState("")
    const [picUpdateSpan, setpicUpdateSpan] = useState("Update Pic")

    const token = cookie.load('jwt')
    const config = {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    useEffect(() => {
        fetch("/api/v1/posts/myProfile", config).then(res => res.json())
            .then(response => {
                if (response.status) {
                    setMyProfile(response.user)
                    setMyPosts(response.posts)
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(true)
            })
    }, [])

    useEffect(() => {
        if (image) {
            setpicUpdateSpan("Updating...")
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "saman5")
            fetch("https://api.cloudinary.com/v1_1/saman5/image/upload", {
                method: "POST",
                body: data
            }).then(res => res.json())
                .then(data => {
                    dispatch({ type: "UPDATE_PIC", payload: data.secure_url })
                    fetch("/api/v1/users/updateProfilePic", {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ profilePic: data.secure_url })
                    }).then(res => res.json())
                        .then(response => {
                            if (response.status) {
                                setMyProfile(prevState => {
                                    return {
                                        ...prevState,
                                        profilePic: response.data.profilePic
                                    }
                                })
                                setpicUpdateSpan("Update Pic")
                                M.toast({ html: response.message, classes: "green" })
                            }
                        }).catch(err => {
                            console.log(err)
                            setpicUpdateSpan("Update Pic")
                            M.toast({ html: err.message, classes: "red" })
                        })
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updateProfilePic = file => {
        setImage(file)
    }

    return (
        <>
            {loading ? <h2 className="insta-logo loading">Loading...</h2> :
                <div className="profile">
                    <div className="row profile-about">
                        <div className="col s12 m4 mobile-view-div">
                            <img className="profile-img" alt={myProfile.fullName} src={myProfile.profilePic} />
                            <div className="file-field input-field profile-btn">
                                <div className="btn blue darken-1">
                                    <span>{picUpdateSpan}</span>
                                    <input type="file" onChange={e => updateProfilePic(e.target.files[0])} />
                                </div>
                                <div style={{ display: "none" }} className="file-path-wrapper">
                                    <input className="file-path validate" type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m8">
                            <div className="my-detail-div" style={{ display: "flex", flexDirection: "column" }}>
                                <h4>{myProfile.fullName}</h4>
                                <div className="follower-details">
                                    <h6 className="profile-details">{myPosts.length} posts</h6>
                                    <h6 className="profile-details">{myProfile.followers.length} followers</h6>
                                    <h6 className="profile-details">{myProfile.following.length} following</h6>
                                </div>
                                <Link className="btn waves-effect waves-light blue darken-1 edit-profile" to="/editProfile">Edit Profile</Link>
                            </div>
                        </div>
                    </div>
                    <div className="insta-gallery">
                        {
                            myPosts.length ? myPosts.map(post => {
                                return (
                                    <img key={post._id} alt={post.title} className="item" src={post.imageUrl} />
                                )
                            }) : <h2 className="insta-logo loading">No posts uploaded!</h2>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default Profile