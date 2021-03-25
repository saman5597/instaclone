import React, { useEffect, createContext, useReducer, useContext } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import cookie from 'react-cookie'
import Navbar from './components/Navbar'
import CreatePost from './components/screens/CreatePost'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import { initialState, reducer } from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import FollowedUserPosts from './components/screens/FollowedUserPosts'
import EditProfile from './components/screens/EditProfile'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const token = cookie.load('jwt')
  const { state, dispatch } = useContext(UserContext)

  const config = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    if (token) {
      fetch("/api/v1/posts/myProfile", config).then(res => res.json())
        .then(response => {
          if (response.status) {
            dispatch({ type: "USER", payload: response.user })
          }
        }).catch(err => console.log(err))
    } else {
      history.push('/login')
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/myFollowedPosts">
        <FollowedUserPosts />
      </Route>
      <Route path="/editProfile">
        <EditProfile />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
