import React, { useState, useEffect } from 'react'
import Destination from './Destination'
import { useDispatch, useSelector } from 'react-redux'
import FolllowedDestinations from './FolllowedDestinations'
import { makeStyles } from '@material-ui/core/styles';
import './DisplayGuest.css'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 2,
    },
    card: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
export default function DisplayGuest({ history }) {

    const classes = useStyles();
    if (JSON.parse(localStorage.getItem('signIn') === null || JSON.parse(localStorage.getItem('signIn')).role === 'admin')) history.push('/login')

    const [destinations, setDestinations] = useState([])
    const [myDestinations, setMyDestinations] = useState([])
    const [handleChange, setHandleChange] = useState([])
    const dispatch = useDispatch()
    const isLogged = useSelector(state => state.isLogged)
    let user = history.location.state === undefined ? '' : (history.location.state.user)

    if (!isLogged.id) history.push('/login')
    useEffect(() => {
         let isMounted = true;
         if (isMounted) {
            displayDestinations()
            setTimeout(() => {
                displayFollowedDestinations()    
            }, 50);
           
        }
         return () => { isMounted = false }
    },[handleChange])
  
    const displayDestinations = async () => {
        let signedUser = JSON.parse(localStorage.getItem('signIn'))
        try {
            const res = await fetch('http://localhost:1110/vacations/all/' + user.id, {
                headers: { 'x-access_token': signedUser.access_token, 'refresh_token': signedUser.refresh_token }
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
                localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
                let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
                try {
                    const res = await fetch('http://localhost:1110/vacations/all/' + user.id, {
                        headers: { 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token }
                    })
                    const data = await res.json()
                    console.log(data)
                    setDestinations(data.destinations)
                    console.log(data.destinations)
                    localStorage.setItem("signIn", JSON.stringify(refreshedUser))
                }
                catch (err) {
                    console.log(err, err.msg)
                }
            } else {
                setDestinations(data.destinations)
                console.log(data.destinations)
                console.log("No refresh")
                localStorage.setItem("signIn", JSON.stringify(signedUser))
            }
        } catch (err) {
            console.log(err, err.msg)
        }
    }
    const displayFollowedDestinations = async () => {
        let signedUser = JSON.parse(localStorage.getItem('signIn'))
        try {
            const res = await fetch('http://localhost:1110/vacations/followed/' + user.id, {
                headers: { 'x-access_token': signedUser.access_token, 'refresh_token': signedUser.refresh_token }
            })
            const data = await res.json()
            setMyDestinations(data.myDestinations)
            localStorage.setItem("signIn", JSON.stringify(signedUser))
        } catch (err) {
            console.log(err, err.msg)
        }
    }

    return (
        <div className="display-guest">
            <div className="fixed-headings">
                <h2 className="welcome">WELCOME {history.location.state === undefined ? '' : user.name.toUpperCase()}</h2>

            </div>
            <div className="followed-cards">
                <div className="favorite">
                    {myDestinations ? (myDestinations.length > 0 ? (myDestinations.length === 1 ? <h2 >Your favorite destination</h2> : <h2>Your favorite destinations</h2>) : '') : ''}
                </div>
                <div className="followed-grid">
                    {myDestinations ? myDestinations.map(mydestination =>
                        <div className="followed-card" key={mydestination.id}>
                            <FolllowedDestinations  id={mydestination.id} destination_id={mydestination.destination_id} image={mydestination.image} name={mydestination.name} price={mydestination.price} startsFrom={mydestination.starts_from} endsAt={mydestination.ends_at}
                                followers={mydestination.followers} moreInfo={mydestination.more_info} setHandleChange={setHandleChange} /> </div>) : ''}
                </div>
            </div>

            <div className="headings">
                {destinations ? (destinations.length === 1 ? <h2 className="all">Am I The Only One You Don't Like?</h2> : <h2 className="all">All Destinations</h2>) : ''}
            </div>

            <div className="display-cards">
                <div className={classes.root}>
                    <div className="grid">

                        {destinations ? destinations.map(destination =>
                            <div className="card" key={destination.id}>
                                <Destination  id={destination.id} image={destination.image} name={destination.name} price={destination.price} startsFrom={destination.starts_from} endsAt={destination.ends_at}
                                    followers={destination.followers} moreInfo={destination.more_info} myDestinations={myDestinations} setHandleChange={setHandleChange} /></div>) : ""}

                    </div>
                </div>
            </div>
        </div>
    )
}
