
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
    throw userInfo;
  }
}

function addNewSurvey(survey) {
  const surveyToSend = {
    title: survey.title,
    questions: survey.questions
  }

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
          if(err){
            if(err.error)
              reject(err.error);  
          }   
        }).catch(() => { reject({ error: "Cannot parse server response." }) });
      }
    }).catch(() => { reject({ error: "Cannot comunicate with server" }) });
  })
};

function getAdminSurveys() {
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


function getSurveys() {
  return new Promise((resolve, reject) => {
    fetch('/api/surveys').then((response) => {
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


function sendSurveyAnswers(answers) {

  return new Promise((resolve, reject) => {
    fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
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

function getAnswers() {
  return new Promise((resolve, reject) => {
    fetch('/api/answers').then((response) => {
      if (response.ok) {
        response.json().then((answers) => {
          const answersFinal = [...answers];
          resolve(answersFinal);
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

const API = {getUserInfo, logIn, logOut, addNewSurvey, getAdminSurveys, getSurveys, sendSurveyAnswers, getAnswers};
export default API;
