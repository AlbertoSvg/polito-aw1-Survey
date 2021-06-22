import { useState, useEffect } from "react";
import MyNavbar from "./components/Navbar.js";
import { LoginForm } from "./components/LoginComponent.js";
import AdminPage from "./components/AdminPage.js";
import GuestPage from "./components/GuestPage.js";
import CompileSurvey from "./components/CompileSurvey.js";
import AnswersPage from "./components/AnswersPage.js";
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
  const [dirty, setDirty] = useState(true); //indica se è dirty
  const [surveysAdmin, setSurveysAdmin] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [sending, setSending] = useState({ state: false, idS: -1 });
  const [answers, setAnswers] = useState([]);

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

    const loadAnswers = async () => {
      const answers = await API.getAnswers();
      setAnswers(answers);
    }


    if (loggedIn && dirty) {
      console.log("ADMIN");
      setLoading(true);
      loadSurveys().then(() => {

        loadAnswers().then(() => {
          setDirty(false);
          setLoading(false);
        }).catch(err => {
          setMessage({ msg: err.error + " Impossible to load answers! Please, try again later...", type: 'danger' });
          setLoading(false);
        })

      }).catch(err => {
        setMessage({ msg: err.error +" Impossible to load surveys! Please, try again later...", type: 'danger' });
        setLoading(false);
      });
    }
  }, [dirty, loggedIn]);

  useEffect(() => {
    const loadSurveys = async () => {
      const surveys = await API.getSurveys();
      setSurveys(surveys);
    };

    if (!loggedIn && dirty) {
      console.log("USER");
      setLoading(true);
      loadSurveys().then(() => {
        setDirty(false);
        setLoading(false);
      }).catch(err => {
        setMessage({ msg: err.error + " Impossible to load surveys! Please, try again later...", type: 'danger' });
        setLoading(false);
      });
    }
  }, [dirty, loggedIn]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setLoggedIn(true);
      setDirty(true);
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
    setDirty(true);
  }

  const addSurvey = (survey) => {
    setSurveysAdmin(oldSurveys => [...oldSurveys, survey]); //da usare poi

    API.addNewSurvey(survey)
      .then(() => setDirty(true))
      .catch((err) => {
        setMessage({ msg: err.error + ' Impossible to create a new survey. Please try again.', type: 'danger' });
        setDirty(true);
      });

  };

  const sendSurveyAnswers = (response) => {
    setSending({ state: true, idS: response.idS });

    API.sendSurveyAnswers(response)
      .then(() => {
        setSending({ state: false, idS: response.idS });
        setDirty(true)
      })
      .catch((err) => {
        setSending({ state: false, idS: response.idS });
        setMessage({ msg: err.error + ' Impossible to send the result. Please try again.', type: 'danger' });
        setDirty(true);
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
          {isMounting ? '' : <> {loggedIn ? <AdminPage loading={loading} setDirty={setDirty} surveys={surveysAdmin} answers={answers} message={message} setMessage={setMessage} doLogIn={doLogIn}></AdminPage> : <Redirect to="/surveys" />} </>}
        </Route>

        <Route exact path="/surveys">
          {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <GuestPage sending={sending} message={message} setMessage={setMessage} loading={loading} surveys={surveys} setDirty={setDirty} ></GuestPage>}</>}
        </Route>

        <Route exact path="/surveys/compile">
          {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <CompileSurvey setDirty={setDirty} sendSurveyAnswers={sendSurveyAnswers}></CompileSurvey>}</>}
        </Route>

        <Route exact path="/admin/add">
          {isMounting ? '' : <> {loggedIn ? <Questionary setDirty={setDirty} addSurvey={addSurvey}></Questionary> : <Redirect to="/surveys" />} </>}
        </Route>

        <Route exact path="/admin/surveys/:idS/answers">
          {isMounting ? '' : <> {loggedIn ? <AnswersPage setDirty={setDirty}></AnswersPage> : <Redirect to="/surveys" />} </>}
        </Route>

        <Route path="/">
          {isMounting ? '' : <> {loggedIn ? <Redirect to="/admin/surveys" /> : <Redirect to="/surveys" />} </>}
        </Route>
      </Switch>

    </Router>
  );
}

export default App;
