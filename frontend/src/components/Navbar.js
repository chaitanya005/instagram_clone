
import React ,{ useContext} from 'react'
//{Link} for to not to refesh and to get instant results
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar = ()  => {
    const {state, dispatch} = useContext (UserContext)
    const history  = useHistory()
    const renderList  = () => {
        if (state) {
            return [
                <li><Link to ="/profile">Profile</Link></li>,
                <li><Link to ="/create">Create Post</Link></li>,
                <li><Link to ="/myfollowingpost">Following Posts</Link></li>,
                <li>
                    <button className="btn #c62828 red darken-3" 
                    onClick = {() => {
                        localStorage.clear()
                        dispatch({type : "CLEAR"})
                        history.push('/signin')
                    }}
                    >
                        Signout
                    </button>
                </li>
            ]
        } else {
            return [
                <li><Link to ="/signup">Signup</Link></li>,
                <li><Link to ="/signin">Signin</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white" >
            <Link to ={state ? "/" : "/signin" } className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>
        </nav>
    )
}

export default NavBar