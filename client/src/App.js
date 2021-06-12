import { useState, useEffect } from "react";
import MyNavbar from "./components/Navbar.js";
import { LoginForm } from "./components/LoginComponent.js";
import AdminPage from "./components/AdminPage.js"
import GuestPage from "./components/GuestPage.js"
import './App.css';
import API from "./services/Api.js";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Questionary from "./components/FormCreationPage.js";


function App() {
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [isMounting, setIsMounting] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
        setIsMounting(false);
      }
      catch (err) {
        console.error(err.error);
        setIsMounting(false);
      }
    };
    checkAuth();
  }, []);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setLoggedIn(true);
      setUser(user);
      return null
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      return err;
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
  }

  return <Questionary></Questionary>; {/*<Router>
    <MyNavbar user={user} loggedIn={loggedIn} doLogOut={doLogOut}></MyNavbar>
    <Switch>
      <Route exact path="/login">
        {isMounting ? '' : <> {loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />} </>}
      </Route>

      <Route exact path="/admin/surveys">
        {isMounting ? '' : <> {loggedIn ? <AdminPage message={message} doLogIn={doLogIn}></AdminPage> : <Redirect to="/surveys" />} </>}
      </Route>

      <Route exact path="/surveys">
        <GuestPage></GuestPage>
      </Route>

      <Route path="/">
        {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <Redirect to="/surveys" />} </>}
      </Route>
    </Switch>

  </Router>*/}
  
}

export default App;
