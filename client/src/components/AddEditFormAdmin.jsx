import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './AddEditForm.css'
export default function AddEditFormAdmin({ history }) {


    if (JSON.parse(localStorage.getItem('signIn') === null || JSON.parse(localStorage.getItem('signIn')).role !== 'admin')) history.push('/login')
    console.log(history)

    const dispatch = useDispatch()
    const [image, setImage] = useState(history.location.state === undefined ? '' : history.location.state.image)
    const [name, setName] = useState(history.location.state === undefined ? '' : history.location.state.name)
    const [price, setPrice] = useState(history.location.state === undefined ? '' : history.location.state.price)
    const [startsFrom, setStartsFrom] = useState(history.location.state === undefined ? '' : history.location.state.startsFrom)
    const [endsAt, setEndsAt] = useState(history.location.state === undefined ? '' : history.location.state.endsAt)
    const [followers, setFollowers] = useState(history.location.state === undefined ? '' : history.location.state.followers || 0)
    const [moreInfo, setMoreInfo] = useState(history.location.state === undefined ? '' : history.location.state.moreInfo)
    const isLogged = useSelector(state => state.isLogged)
    if (!isLogged.id) history.push('/login')
    const addDestination = async () => {
        const signedInUser = JSON.parse(localStorage.getItem('signIn'))
        console.log(signedInUser)
        try {
            const res = await fetch('http://localhost:1110/vacations/add', {
                method: "POST",
                headers: { "Content-Type": "application/json", 'x-access_token': signedInUser.access_token, 'refresh_token': signedInUser.refresh_token },
                body: JSON.stringify({ image, name, price, startsFrom, endsAt, followers, moreInfo })
            })
            const data = await res.json()

            if (data === "Please log in") {
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
                    history.push('/login')
                } catch (err) {
                    console.log(err, err.msg)
                }
            } else if (data.refreshedUser) {
                dispatch({ type: "LOG_IN", payload: data.refreshedUser })
                console.log("refresh works")
                localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
                let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
                console.log(refreshedUser)
                try {
                    const res = await fetch('http://localhost:1110/vacations/add', {
                        method: "POST",
                        headers: { "Content-Type": "application/json", 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token },
                        body: JSON.stringify({ image, name, price, startsFrom, endsAt, followers, moreInfo })
                    })
                    const data = await res.json()
                    console.log(data)
                    history.push('/AdminDisplay')
                    localStorage.setItem("signIn", JSON.stringify(refreshedUser))
                }
                catch (err) {
                    console.log(err, err.msg)
                }
            } else {
                dispatch({ type: "LOG_IN", payload: data })
                console.log(data.newDestination)
                history.push('/AdminDisplay')
                console.log("No refresh")
                localStorage.setItem("signIn", JSON.stringify(signedInUser))
            }
        } catch (err) {
            console.log(err, err.msg)
        }
    }
    const editDestination = async () => {
        console.log(history.location.state.id)
        const signedInUser = JSON.parse(localStorage.getItem('signIn'))
        try {
            const res = await fetch('http://localhost:1110/vacations/edit/admin/' + history.location.state.id, {
                method: "PUT",
                headers: { "Content-Type": "application/json", 'x-access_token': signedInUser.access_token, 'refresh_token': signedInUser.refresh_token },
                body: JSON.stringify({ image, name, price, startsFrom, endsAt, followers, moreInfo })
            })

            const data = await res.json()
            if (data === "Please log in") {
                try {
                    const storedToken = JSON.parse(localStorage.getItem("signIn"))
                    
                    const res = await fetch('http://localhost:1110/auth/logout', {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ storedToken })
                    })
                    const data = await res.json()
                    dispatch({ type: "LOG_OUT", payload: data })
                    localStorage.removeItem("signIn")
                    history.push('/login')
                } catch (err) {
                    console.log(err, err.msg)
                }
            } else if (data.refreshedUser) {
                dispatch({ type: "LOG_IN", payload: data.refreshedUser })
                localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
                let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
                history.push('/AdminDisplay')
                try {
                    const res = await fetch('http://localhost:1110/vacations/edit/admin/' + history.location.state.id, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token },
                        body: JSON.stringify({ image, name, price, startsFrom, endsAt, followers, moreInfo })
                    })
                    const data = await res.json()
                    console.log(data)
                    localStorage.setItem("signIn", JSON.stringify(refreshedUser))
                }
                catch (err) {
                    console.log(err, err.msg)
                }
            } else {
                console.log(data.updatedDestination)
                history.push('/AdminDisplay')
                localStorage.setItem("signIn", JSON.stringify(signedInUser))
            }

        } catch (err) {
            console.log(err, err.msg)
            history.push('/login')
        }
    }



    return (
        <div className="addedit">
            <div className="form">
                <h3>Add/Edit destination here</h3>
                <TextField onChange={e => setImage(e.target.value)} id="standard-required1" label="Image" value={image} />
                <TextField onChange={e => setName(e.target.value)} id="standard-required2" label="Name" value={name} />
                <TextField onChange={e => setPrice(e.target.value)} id="standard-required3" label="Price" value={price} />
                <TextField onChange={e => setStartsFrom(e.target.value)} id="standard-required4" label="Starts From" value={startsFrom} />
                <TextField onChange={e => setEndsAt(e.target.value)} id="standard-required5" label="Ends At" value={endsAt} />
                <TextField onChange={e => setFollowers(e.target.value)} id="standard-required6" label="Followers" value={followers} />
                <TextField onChange={e => setMoreInfo(e.target.value)} id="standard-required7" label="More Info" value={moreInfo} className='textfield' />
                {history.location.state === undefined ? '' : history.location.state.type === "addDestination" ? (<Button onClick={addDestination} variant="contained" color="primary"
                    disabled={!image || !name || !price || !startsFrom || !endsAt || !moreInfo}>
                    ADD</Button>) : (<Button onClick={editDestination} variant="contained" color="primary" className="btn">EDIT</Button>)}
                <h4>Changed you'r mind? Return to your<Link to='/displayadmin'> Home page</Link></h4>
            </div>
        </div>
    )
}
