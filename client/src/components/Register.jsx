
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom'
import './Register.css'

export default function Register() {

    const history = useHistory()

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role] = useState('')
    const [user, setUser] = useState()


    const register = async (err) => {

        try {
            const res = await fetch('http://localhost:1110/auth/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, surname, username, password, role })
            })
            const data = await res.json()
            if (!data.msg) {
                history.push('/')
            } else {
                setUser(data)
            }
        } catch (err) {
            setUser(err)
            console.log(err, err.msg)
        }
    }

    return (
        <div className="register">
            <div className='register-form'>
                <TextField required id="standard-required-1"
                    label="NAME" onChange={e => setName(e.target.value)} value={name} />
                <TextField required id="standard-required-2"
                    label="SURNAME" onChange={e => setSurname(e.target.value)} value={surname} />
                <TextField required id="standard-required-3"
                    label="USERNAME" onChange={e => setUsername(e.target.value)} value={username} />
                <TextField required id="standard-required-4"
                    label="PASSWORD" onChange={e => setPassword(e.target.value)} value={password} />
                <div className="btn-register"></div>
                <Button onClick={register} variant="contained" color="primary" className="btn-itself">
                    Register
                </Button>
                <div className="msg-1">
                    {user ? <h3>{user.msg}</h3> : ''}
                </div>
                <div className="msg-2">
                    <h3>Already registered? Please,login <Link to='/login'>here</Link> </h3>
                </div>
            </div>
        </div>
    )
}
