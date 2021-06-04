import React, { useState, useEffect,useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Login.css'

export default function Login() {

    const dispatch = useDispatch()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState([])
    const isMountedRef = useRef(true)
    useEffect(() => {
        if (localStorage.signIn) {
            loggedIn()
            isMountedRef.current=false
        }
    }, [])

    let signedUser = {}
    const login = async () => {
        try {
            const res = await fetch('http://localhost:1110/auth/login', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()
            console.log(data)
            signedUser = data[0]
            console.log(signedUser)
            dispatch({
                type: 'LOG_IN', payload: data[0]
            })
            
            if (signedUser.access_token && signedUser.role === 'guest') {
                localStorage.setItem("signIn", JSON.stringify(signedUser))
                history.push('/displayguest', { user: signedUser })
            } else if (signedUser.access_token && signedUser.role === 'admin') {
                localStorage.setItem("signIn", JSON.stringify(signedUser))
                history.push('/displayadmin', { user: signedUser })
            } else {
                setUser(data)
            }
        } catch (err) {
            console.log(err, err.msg)
        }
        console.log(signedUser)
    }
    ///////////////////////////////////////////////////////////////////////////
    const loggedIn = async () => {
        const signedInUser = JSON.parse(localStorage.getItem('signIn'))

        try {
            const res = await fetch('http://localhost:1110/auth/secret/' + signedInUser.id, {
                headers: { 'x-access_token': signedInUser.access_token, 'refresh_token': signedInUser.refresh_token },
            })
            const data = await res.json()
            setUser(data[0])
            dispatch({
                type: 'LOG_IN', payload: data[0]
            })
            signedUser = data[0]
            console.log(signedUser)
            if (signedUser.access_token && signedUser.role === 'guest') {
                history.push('/displayguest', { user: signedUser })
                localStorage.setItem("signIn", JSON.stringify(signedUser))
            } else if (signedUser.access_token && signedUser.role === 'admin') {
                history.push('/displayadmin', { user: signedUser })
                localStorage.setItem("signIn", JSON.stringify(signedUser))
            } else {
                setUser(data)
            }
        } catch (err) {
            console.log(err, err.msg)
        }
    }


    return (
        <div className='login'>
            <div className="login-form">

                <TextField required id="standard-required-1"
                    label="USERNAME" onChange={e => setUsername(e.target.value)} value={username} />
                <TextField required id="standard-required-2"
                    label="PASSWORD" onChange={e => setPassword(e.target.value)} value={password} />
                <div className="btn-login">
                    <Button onClick={login} variant="contained" color="primary">
                        LOGIN
                </Button>
                </div>
                {user ? <h3>{user.msg}</h3> : ''}
                <h3>Don't have an account yet? Please <Link to='/register'> register here</Link></h3>
            </div>
        </div>
    )
}
