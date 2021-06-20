import { useState, useEffect } from "react";
import MyNavbar from "./components/Navbar.js";
import { LoginForm } from "./components/LoginComponent.js";
import AdminPage from "./components/AdminPage.js";
import GuestPage from "./components/GuestPage.js";
import CompileSurvey from "./components/CompileSurvey.js";
import './App.css';
import API from "./services/Api.js";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Questionary from "./components/FormCreationPage.js";


function App() {
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [isMounting, setIsMounting] = useState(true);
  const [surveysChanged, setSurveysChanged] = useState(true); //indica se è dirty
  const [surveysAdmin, setSurveysAdmin] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [sending, setSending] = useState({state: false, idS: -1});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
        setLoading(true);
        setIsMounting(false);
      }
      catch (err) {
        console.error(err.error);
        setIsMounting(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadSurveys = async () => {
      const surveys = await API.getAdminSurveys();
      setSurveysAdmin(surveys);
    };

    if(loggedIn && surveysChanged){
      console.log("ADMIN");
      setLoading(true);
      loadSurveys().then(() => {
        setSurveysChanged(false);
        setLoading(false);
      }).catch(err => {
        setMessage({ msg: "Impossible to load surveys! Please, try again later...", type: 'danger' });
        setLoading(false);
        console.error(err);
      });
    }
  }, [surveysChanged, loggedIn]);

  useEffect(() => {
    const loadSurveys = async () => {
      const surveys = await API.getSurveys();
      setSurveys(surveys);
    };

    if(!loggedIn && surveysChanged){
      console.log("USER");
      setLoading(true);
      loadSurveys().then(() => {
        setSurveysChanged(false);
        setLoading(false);
      }).catch(err => {
        setMessage({ msg: "Impossible to load surveys! Please, try again later...", type: 'danger' });
        setLoading(false);
        console.error(err);
      });
    }
  }, [surveysChanged, loggedIn]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setLoggedIn(true);
      setSurveysChanged(true);
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
    setLoading(true);
    setSurveysChanged(true);
  }

  const addSurvey = (survey) => {
    setSurveysAdmin(oldSurveys => [...oldSurveys, survey]); //da usare poi
    
    API.addNewSurvey(survey)
      .then(() => setSurveysChanged(true))
      .catch((err) => {
        setMessage({ msg: ' Impossible to create a new survey. Please try again later.', type: 'danger' });
        setSurveysChanged(true);
      });

  };

  const sendSurveyAnswers = (response) => {
    setSending({state: true, idS: response.idS});

    API.sendSurveyAnswers(response)
      .then(()=>{
        setSending({state: false, idS: response.idS});
        setSurveysChanged(true)
      })
      .catch((err) => {
        setSending({state: false, idS: response.idS});
        setMessage({ msg: ' Impossible to send the result. Please try again later.', type: 'danger' });
        setSurveysChanged(true);
      })
  }

  return (
  <Router>
    <MyNavbar user={user} loggedIn={loggedIn} doLogOut={doLogOut}></MyNavbar>
    <Switch>
      <Route exact path="/login">
        {isMounting ? '' : <> {loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />} </>}
      </Route>

      <Route exact path="/admin/surveys">
        {isMounting ? '' : <> {loggedIn ? <AdminPage loading={loading} setSurveysChanged={setSurveysChanged} surveys={surveysAdmin} message={message} doLogIn={doLogIn}></AdminPage> : <Redirect to="/surveys" />} </>}
      </Route>

      <Route exact path="/surveys">
      {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <GuestPage sending={sending} message={message} setMessage={setMessage} loading={loading} surveys={surveys} setSurveysChanged={setSurveysChanged} ></GuestPage>}</>}
      </Route>

      <Route exact path="/surveys/compile">
      {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <CompileSurvey sendSurveyAnswers={sendSurveyAnswers}></CompileSurvey>}</>}
      </Route>

      <Route exact path="/admin/add">
        {isMounting ? '' : <> {loggedIn ? <Questionary addSurvey={addSurvey}></Questionary> : <Redirect to="/surveys" />} </>}
      </Route>

      <Route path="/">
        {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <Redirect to="/surveys" />} </>}
      </Route>
    </Switch>

  </Router>
  );
}

export default App;
