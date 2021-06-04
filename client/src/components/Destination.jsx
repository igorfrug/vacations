import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';


const useStyles = makeStyles({
  root: {
    maxWidth: 400, minWidth: 250,
  },
  media: {
    height: 150,
  },
});


export default function Destination({ setHandleChange, id, image, name, price, startsFrom, endsAt, followers, moreInfo, myDestinations,history }) {
  const classes = useStyles();

  const isLogged = useSelector(state => state.isLogged)
  const dispatch = useDispatch()
 





  const followMeFunction = async (id) => {
    const userId = isLogged.id
    const destinationId = id

    let signedInUser = JSON.parse(localStorage.getItem('signIn'))
    console.log(signedInUser)
    try {
      const res = await fetch('http://localhost:1110/vacations/follow', {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access_token": signedInUser.access_token, "refresh_token": signedInUser.refresh_token },
        body: JSON.stringify({ destinationId, image, name, price, startsFrom, endsAt, followers, moreInfo, userId })
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
        localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
        let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
        console.log(refreshedUser)
        try {
          const res = await fetch('http://localhost:1110/vacations/follow', {
            method: "POST",
            headers: { "Content-Type": "application/json", 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token },
            body: JSON.stringify({ destinationId, image, name, price, startsFrom, endsAt, followers, moreInfo, userId })
          })
          const data = await res.json()
          console.log(data)
          dispatch({
            type: "FOLLOW", payload: data
          })
          setHandleChange(data.followedDestinations)
          localStorage.setItem("signIn", JSON.stringify(refreshedUser))
        } catch (err) {
          console.log(err, err.msg)
        }
      } else {
        dispatch({
          type: "FOLLOW", payload: data
        })
        setHandleChange(data.followedDestinations)
        localStorage.setItem("signIn", JSON.stringify(signedInUser))
      }
    } catch (err) {
      console.log(err, err.msg)
    }
  }






  return (
    <div className="card">
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={image}
            title={name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Price: {price}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Departure: {startsFrom}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Return: {endsAt}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Followers: {followers}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
                  More Info
          </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Box p={2}>
                    <Typography>{moreInfo}.</Typography>
                  </Box>
                </Popover>
              </div>
            )}
          </PopupState>
          <Button onClick={e => followMeFunction(id)} variant="contained" color="primary">Follow Me</Button>
        </CardActions>
      </Card>




    </div>
  )
}
