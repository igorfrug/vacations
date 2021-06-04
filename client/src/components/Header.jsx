import React from 'react'
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './Header.css'
export default function Header() {

    const history = useHistory()
    console.log(history)

    const dispatch = useDispatch()
    const isLogged = useSelector(state => state.isLogged)
    console.log(isLogged)
    const logout = async () => {
        try {
            const storedToken = JSON.parse(localStorage.getItem("signIn"))
            localStorage.removeItem("signIn")
            const res = await fetch('http://localhost:1110/auth/logout', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ storedToken })
            })
            const data = await res.json()
            dispatch({ type: "LOG_OUT", payload: data })
            history.push('/home')
        } catch (err) {
            console.log(err,err.msg)
        }
    }
    return (
        <div className="header">
            <div className="logo"><img src="https://th.bing.com/th/id/R5613fb7a88d762eec6dfd16b0027d87b?rik=z4H%2bLA6pfEMZAQ&riu=http%3a%2f%2fthumbs.dreamstime.com%2ft%2ffrog-pilot-27196361.jpg&ehk=45q3U4E00cChSQ%2b6tUtXs6mAQDO7F598qFn%2fOMRp0p0%3d&risl=&pid=ImgRaw" alt="logo"/></div>
            <div className ="center">
                <h1>FROG THE TRAVELLER</h1>
            </div>
            <div className="logout">
               {JSON.parse(localStorage.getItem('signIn'))===null && !isLogged.id  ?(<h4>Welcome guest!</h4>) :  <Button onClick={logout} variant="contained" color="primary" >
                    Log Out
                </Button>}
            </div>
        </div>
    )
}
