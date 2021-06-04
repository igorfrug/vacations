import React from 'react'
import Button from '@material-ui/core/Button';
import { useSelector,useDispatch } from 'react-redux'
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
    maxWidth: 400, minWidth: 250
  },
  media: {
    height: 150,
  },
});
export default function DestinationAdmin({ id, image, name, price, startsFrom, endsAt, followers, moreInfo, history, setHandleChange }) {
  const classes = useStyles();


 
const dispatch=useDispatch()
  const isLogged = useSelector(state => state.isLogged)
console.log(isLogged)


  const deleteDestination = async (id) => {

    const signedInUser = JSON.parse(localStorage.getItem('signIn'))
    try {
      const res = await fetch('http://localhost:1110/vacations/delete/admin/' + id, {
        method: "DELETE",
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
          dispatch({ type: "LOG_OUT", payload: data })
           history.push('/login')
        } catch (err) {
          console.log(err, err.msg)
        }
      } else if (data.refreshedUser) {
        dispatch({ type: "LOG_OUT", payload: data.refreshedUser })
        localStorage.setItem("signIn", JSON.stringify(data.refreshedUser))
        let refreshedUser = JSON.parse(localStorage.getItem('signIn'))
        try {
          const res = await fetch('http://localhost:1110/vacations/delete/admin/' + id, {
            method: "DELETE",
            headers: { 'x-access_token': refreshedUser.access_token, 'refresh_token': refreshedUser.refresh_token }
          })
          const data = await res.json()
          setHandleChange(data.destinations)
          localStorage.setItem("signIn", JSON.stringify(refreshedUser))
        }
        catch (err) {
          console.log(err, err.msg)
        }
      } else {
        setHandleChange(data.destinations)
        localStorage.setItem("signIn", JSON.stringify(signedInUser))
      }
    } catch (err) {
      console.log(err, err.msg)
      history.push('/login')
    }
  }
    return (
      <div>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={image}
              title={name}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="h5">
                {name}
              </Typography>
              <Typography gutterBottom variant="h6" component="h5">
                Price: {price}
              </Typography>
              <Typography gutterBottom variant="h6" component="h5">
                Departure: {startsFrom}
              </Typography>
              <Typography gutterBottom variant="h6" component="h5">
                Return: {endsAt}
              </Typography>
              <Typography gutterBottom variant="h6" component="h5">
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
            <Button onClick={e => deleteDestination(id)} variant="contained" size="small" color="primary">
              Delete
                </Button>
            <Button onClick={e => history.push('/AddEditFormAdmin',
              {
                type: "editDestination", id: id, image: image, name: name, price: price, startsFrom: startsFrom, endsAt: endsAt, followers:
                  followers, moreInfo: moreInfo
              })}
              variant="contained" size="small" color="primary">
              EDIT
                </Button>
          </CardActions>
        </Card>
      </div>
    )
  }
