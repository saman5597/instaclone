import React, { useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../App'
import '../App.css'

function Navbar() {

    const history = useHistory()

    useEffect(() => {
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems);
        });
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

    const renderList = () => {
        if (state) {
            return [
                <li key={0}><Link to="/profile">Profile</Link></li>,
                <li key={1}><Link to="/create">Create Post</Link></li>,
                <li key={2}><Link to="/myFollowedPosts">Followed Posts</Link></li>,
                <li key={3} className="logout-btn">
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
            <ul className="sidenav" id="mobile-demo">
                {renderList()}
            </ul>
        </>
    )
}

export default Navbar
