import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import cookie from 'react-cookie'
import { UserContext } from '../App'
import '../App.css'

function Navbar() {

    const history = useHistory()
    const token = cookie.load('jwt')
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])

    const searchModal = useRef(null)
    const navBar = useRef(null)

    useEffect(() => {
        const modalOptions = {
            dismissible: false
        }

        M.Sidenav.init(navBar.current)
        M.Modal.init(searchModal.current, modalOptions)
    }, [])

    const { state, dispatch } = useContext(UserContext)

    const logout = () => {
        fetch("/api/v1/auth/logout").then(res => res.json())
            .then(response => {
                dispatch({ type: "CLEAR" })
                M.toast({ html: response.message, classes: "green" })
                history.push('/login')
            })
            .catch(err => console.log(err))
    }

    const fetchUsers = query => {
        setSearch(query)
        if (query) {
            fetch('/api/v1/users/searchUsers', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query })
            }).then(res => res.json())
                .then(data => {
                    setUserDetails(data.user)
                })
                .catch(err => {
                    console.log(err)
                })
        } else
            setUserDetails([])
    }

    const renderList = () => {
        if (state) {
            return [
                <li key={0}><i data-target="modal1" className="large material-icons modal-trigger action-button" style={{ color: "black" }}>search</i></li>,
                <li key={1}><Link to="/profile">Profile</Link></li>,
                <li key={2}><Link to="/create">Create Post</Link></li>,
                <li key={3}><Link to="/myFollowedPosts">Followed Posts</Link></li>,
                <li key={4} className="logout-btn">
                    <button onClick={logout} className="btn btn-small waves-effect waves-light red darken-3">Logout</button>
                </li>
            ]
        } else {
            return [
                <li key={0}><Link to="/login">Login</Link></li>,
                <li key={1}><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <>
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper myNavbar white">
                        <Link to={state ? "/" : "/login"} className="brand-logo insta-logo left">Instagram</Link>
                        <a href="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            {renderList()}
                        </ul>
                    </div>
                </nav>
            </div>
            <ul className="sidenav" id="mobile-demo" ref={navBar}>
                {renderList()}
            </ul>
            {/* Modal Structure  */}
            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <input type="text" onChange={e => fetchUsers(e.target.value)} value={search} placeholder="Search Users" />
                    <ul className="collection searchedList">
                        {
                            userDetails.length ? userDetails.map(user => {
                                return (
                                    <Link to={user._id !== state._id ? `/profile/${user._id}` : "/profile"} onClick={() => {
                                        M.Modal.getInstance(searchModal.current).close()
                                        setSearch("")
                                        setUserDetails([])
                                    }} >
                                        <li key={user._id} className="collection-item">{user.fullName}</li>
                                    </Link>
                                )
                            }) : <li className="collection-item">No user found!</li>
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => {
                        setSearch("")
                        setUserDetails([])
                    }}>Close</button>
                </div>
            </div>
        </>
    )
}

export default Navbar
