
async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

function addNewSurvey(survey) {
  const surveyToSend = {
    title: survey.title,
    questions: survey.questions
  }
  console.log(surveyToSend);

  return new Promise((resolve, reject) => {
    fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyToSend),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      }
      else {
        response.json().then((err) => {
          reject(err);
        }).catch(() => { reject({ error: "Cannot parse server response." }) });
      }
    }).catch(() => { reject({ error: "Cannot comunicate with server" }) });
  })
};

function getSurveys() {
  return new Promise((resolve, reject) => {
    fetch('/api/admin/surveys').then((response) => {
      if (response.ok) {
        response.json().then((surveys) => {
          const surveysFinal = [...surveys];
          resolve(surveysFinal);
        }).catch(() => { reject({ error: "Cannot parse server response." }) });
      }
      else {
        response.json().then((err) => {
          reject(err);
        }).catch(() => { reject({ error: "Cannot parse server response." }) });
      }
    }).catch(() => { reject({ error: "Cannot comunicate with server" }) });
  });
};


const API = {getUserInfo, logIn, logOut, addNewSurvey, getSurveys};
export default API;
