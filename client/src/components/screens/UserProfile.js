import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import cookie from 'react-cookie'

function UserProfile() {

    const { state, dispatch } = useContext(UserContext)
    const [userProfile, setUserProfile] = useState({})
    const [loading, setLoading] = useState(true)

    const { userId } = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true)

    const token = cookie.load('jwt')
    const config = {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    useEffect(() => {
        fetch(`/api/v1/users/${userId}`, config).then(res => res.json())
            .then(response => {
                if (response.status) {
                    setUserProfile(response)
                    // setUserPosts(response.posts)
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(true)
            })
    }, [])

    const followUser = () => {
        fetch('/api/v1/users/followUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ followId: userId })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.data.following, followers: data.data.followers } })
                setUserProfile(prevState => {
                    return {
                        ...prevState, user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data.data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
            .catch(err => console.log(err))
    }

    const unfollowUser = () => {
        fetch('/api/v1/users/unfollowUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ unfollowId: userId })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.data.following, followers: data.data.followers } })
                setUserProfile(prevState => {
                    const newFollower = prevState.user.followers.filter(item => item !== data.data._id)
                    return {
                        ...prevState, user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            { loading ? <h2 className="insta-logo loading">Loading...</h2> :
                <div className="profile">
                    <div className="row profile-about">
                        <div className="col s12 m4"><img className="profile-img" alt={userProfile.user.fullName} src={userProfile.user.profilePic} /></div>
                        <div className="col s12 m8">
                            <div className="user-details-div">
                                <h4>{userProfile.user.fullName}</h4>
                                <h6>{userProfile.user.email}</h6>
                            </div>
                            <div className="follower-details">
                                <h6 className="profile-details">{userProfile.posts.length} posts</h6>
                                <h6 className="profile-details">{userProfile.user.followers.length} followers</h6>
                                <h6 className="profile-details">{userProfile.user.following.length} following</h6>
                            </div>
                            {showFollow ?
                                <a onClick={followUser} className="waves-effect waves-light btn blue darken-1 profile-btn"><i className="material-icons left">add</i>Follow</a> :
                                <a onClick={unfollowUser} className="waves-effect waves-light btn blue darken-1 profile-btn">Unfollow</a>
                            }

                        </div>
                    </div>
                    <div className="insta-gallery">
                        {
                            userProfile.posts.map(post => {
                                return (
                                    <img key={post._id} alt={post.title} className="item" src={post.imageUrl} />
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default UserProfile