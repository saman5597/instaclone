import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import cookie from 'react-cookie'
import M from 'materialize-css'

function FollowedUserPosts() {

    const token = cookie.load('jwt')
    const [data, setData] = useState([])
    const [profile, setProfile] = useState({})
    const [input, setInput] = useState("")

    useEffect(() => {
        const config = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        fetch('/api/v1/posts/getFollowingPosts', config).then(res => res.json())
            .then(response => {
                if (response.status) {
                    setData(response.posts)
                }
            })
            .catch(err => console.log(err))

        fetch("/api/v1/posts/myProfile", config).then(res => res.json())
            .then(response => {
                if (response.status) {
                    setProfile(response.user)
                }
            })
            .catch(err => console.log(err))
    }, [])

    const likePost = postId => {
        fetch('/api/v1/posts/like', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId })
        }).then(res => res.json())
            .then(response => {
                if (response.status) {
                    const newData = data.map(item => {
                        if (item._id === response.result._id) {
                            return response.result
                        } else {
                            return item
                        }
                    })
                    setData(newData)
                }
                else {
                    console.log(response.error)
                }
            }).catch(err => console.log(err))
    }

    const unlikePost = postId => {
        fetch('/api/v1/posts/unlike', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId })
        }).then(res => res.json())
            .then(response => {
                if (response.status) {
                    const newData = data.map(item => {
                        if (item._id === response.result._id) {
                            return response.result
                        } else {
                            return item
                        }
                    })
                    setData(newData)
                }
                else {
                    console.log(response.error)
                }
            }).catch(err => console.log(err))
    }

    const postComment = (postId, text) => {
        fetch('/api/v1/posts/comment', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(response => {
                if (response.status) {
                    const newData = data.map(item => {
                        if (item._id === response.result._id) {
                            return response.result
                        } else {
                            return item
                        }
                    })
                    setData(newData)
                    setInput("")
                }
                else {
                    console.log(response.error)
                }
            }).catch(err => console.log(err))
    }

    const deletePost = postId => {
        fetch('/api/v1/posts/deletePost', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId })
        }).then(res => res.json())
            .then(response => {
                if (response.status) {
                    const newData = data.filter(item => {
                        return item._id !== response.result._id
                    })
                    M.toast({ html: response.message, classes: "red" })
                    setData(newData)
                }
                else {
                    console.log(response.error)
                }
            }).catch(err => console.log(err))
    }

    return (
        <div className="home">

            {
                data.length ? data.map(item => {
                    return (
                        <div key={item._id} className="card home-card">
                            <h5><Link to={item.postedBy._id !== profile._id ? `/profile/${item.postedBy._id}` : "/profile"}>{item.postedBy.fullName}</Link>
                                {
                                    item.postedBy._id === profile._id &&
                                    <i onClick={() => deletePost(item._id)} className="material-icons action-button right">delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img alt={item.title} src={item.imageUrl} />
                            </div>
                            <div className="card-content input-field">
                                {
                                    item.likes.includes(profile._id) ? <i onClick={() => unlikePost(item._id)} className="material-icons action-button like-icon">favorite</i> :
                                        <i onClick={() => likePost(item._id)} className="material-icons action-button">favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(comment => {
                                        return (
                                            <h6 key={comment._id}><span className="posted-by-name">{comment.postedBy.fullName}</span> {comment.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={e => {
                                    e.preventDefault()
                                    postComment(item._id, e.target[0].value)
                                }}>
                                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                }) : <h2 className="insta-logo loading">No posts available!</h2>
            }

        </div>
    )
}

export default FollowedUserPosts
