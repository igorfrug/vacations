import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button';
import DestinationAdmin from './DestinationAdmin';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import './DisplayAdmin.css'


export default function DisplayAdmin({ history }) {

    if (JSON.parse(localStorage.getItem('signIn') === null || JSON.parse(localStorage.getItem('signIn')).role !== 'admin')) history.push('/login')


    const dispatch = useDispatch()
    const isLogged = useSelector(state => state.isLogged)
    console.log(isLogged)
    if (!isLogged.id) history.push('/login')
    const [destinations, setDestinations] = useState([])
    const [handleChange, setHandleChange] = useState([])
    //const isMountedRef = useRef(true)
    useEffect(() => {
        displayDestinations()
        //isMountedRef.current = false
    }, [handleChange])



    const displayDestinations = async () => {
        const signedInUser = JSON.parse(localStorage.getItem('signIn'))
        try {
            const res = await fetch('http://localhost:1110/vacations/admin',
                {
                    headers: { 'x-access_token': signedInUser.access_token, 'refresh_token': signedInUser.refresh_token }
                })
            const data = await res.json()
            console.log(data)
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
                dispatch({ type: "LOG_OUT", payload: data.refreshedUser })
                console.log("refresh works")
                localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
                let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
                try {
                    const res = await fetch('http://localhost:1110/vacations/admin', {
                        headers: { 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token }
                    })
                    const data = await res.json()
                    console.log(data)
                    setDestinations(data.destinations)
                    localStorage.setItem("signIn", JSON.stringify(refreshedUser))
                }
                catch (err) {
                    console.log(err, err.msg)
                }
            } else {

                setDestinations(data.destinations)
                console.log("No refresh")
                localStorage.setItem("signIn", JSON.stringify(signedInUser))
            }
        } catch (err) {
            console.log(err, err.msg)
            history.push('/login')
        }
    }
    return (
        <div>
            <h1>Welcome Admin</h1>
            <div className="admin-cards">
                <div className="admin-grid">
                    {destinations.map(destination =>
                        <div className="admin-card" key={destination.id}>
                            <DestinationAdmin id={destination.id} image={destination.image} name={destination.name} price={destination.price} startsFrom={destination.starts_from} endsAt={destination.ends_at}
                                followers={destination.followers} moreInfo={destination.more_info} history={history} setHandleChange={setHandleChange} /> </div>)}
                </div >
            </div>

            {<Button onClick={() => history.push('/AddEditFormAdmin',
                { type: "addDestination", image: "", name: "", price: "", startsFrom: "", endsAt: "", followers: 0, moreInfo: '' })}
                variant="contained" color="primary" className="add">ADD DESTINATION</Button>}

            <h2>Statistics are <Link to='/statistics'>HERE</Link></h2>

        </div>
    )
}
