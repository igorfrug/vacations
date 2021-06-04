import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from "react-router-dom";
import { VictoryBar, VictoryChart } from "victory";
import "./Statistics.css";


export default function Statistics() {
    const dispatch = useDispatch()
    const isLogged = useSelector(state => state.isLogged)
    console.log(isLogged)

    const [followedDestinations, setFollowedDestinations] = useState([])
    const history = useHistory()


    useEffect(() => {
        if (JSON.parse(localStorage.getItem('signIn') === null || JSON.parse(localStorage.getItem('signIn')).role !== 'admin')) history.push('/login')
        followedDestinationsStatistics()
    }, [])
    const followedDestinationsStatistics = async () => {
        const signedInUser = JSON.parse(localStorage.getItem('signIn'))
        try {
            const res = await fetch('http://localhost:1110/vacations/followed', {
                headers: { 'x-access_token': signedInUser.access_token, 'refresh_token': signedInUser.refresh_token }
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
                    history.push('/login')
                } catch (err) {
                    console.log(err, err.msg)
                }
            } else if (data.refreshedUser) {
                localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
                let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
                try {
                    const res = await fetch('http://localhost:1110/vacations/followed', {
                        headers: { 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token }
                    })
                    const data = await res.json()
                    console.log(data)
                    setFollowedDestinations(data.myDestinations)
                    localStorage.setItem("signIn", JSON.stringify(refreshedUser))
                }
                catch (err) {
                    console.log(err, err.msg)
                }
            } else {
                console.log(data)
                setFollowedDestinations(data.myDestinations)
                localStorage.setItem("signIn", JSON.stringify(signedInUser))
            }
        } catch (err) {
            console.log(err, err.msg)
            history.push('/login')
        }
    }
    const sortedFollowedDestinations = followedDestinations.sort(function (a, b) { return a.followers - b.followers })

    return (
        <div className="statistics">

            <h3>Followers Per Destination</h3>
            <div className="chart">
                <VictoryChart
                    domainPadding={20} width={450}>
                    {sortedFollowedDestinations.map(destination =>
                        <VictoryBar className='bar' key={destination.id} style={{
                            paddingLeft: 5,
                            data: destination.followers === 1 ? { fill: "red", width: 40 } :
                                (destination.followers < 4 ? { fill: "yellow", width: 40, } : { fill: "green", width: 40 })
                        }}
                            data={[
                                {
                                    x: `ID: ${destination.id}
                                 ${destination.name}`,
                                    y: `${destination.followers}`
                                }
                            ]} />
                    )}
                </VictoryChart>
                <h4><Link to='/displayadmin'>Admin page</Link></h4>
            </div>
        </div>
    )
}
