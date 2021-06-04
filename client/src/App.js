import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Register from './components/Register';
import Login from './components/Login';
import DisplayGuest from './components/DisplayGuest'
import DisplayAdmin from './components/DisplayAdmin'
import AddEditFormAdmin from './components/AddEditFormAdmin'
import Header from './components/Header';
import Statistics from './components/Statistics';


function App() {
    return (< div className="App" >
        <Router >
            <Header />
            <Switch>
                <Route path='/home' exact component={Login} />
                <Route path='/register' component={Register} />
                <Route path='/displayguest' component={DisplayGuest} />
                <Route path='/displayadmin' component={DisplayAdmin} />
                <Route path='/addeditformadmin' component={AddEditFormAdmin} />
                <Route path='/statistics'  component={Statistics} />
                <Redirect from="/" to="/home" />
            </Switch> 
        </Router >
    </div>
    );
}

export default App;