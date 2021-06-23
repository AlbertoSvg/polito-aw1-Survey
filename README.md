# Exam #1: "Questionario"
## Student: s280127 SOLAVAGIONE ALBERTO 

## React Client Application Routes

- Route `/`: 
  - Page content: has no content.
  - Purpose: used as a default route that redirect to `/surveys` if the client is not logged in or to `/admin/surveys` if the client is logged.
- Route `/login`:
  - Page content: login page.
  - Purpose: can insert username and password to login in the application.
- Route `/surveys`: 
  - Page content: this route contains the page for the non logged users where all the surveys are listed.
  - Purpose: the user can choose a survey to answer.
- Route `/surveys/compile`:
  - Page content: compilation page for a survey.
  - Purpose: in this page the user can answer to the survey that has selected from the table.
- Route `/admin/surveys`:
  - Page content: this route contains the page for the logged users (admins) where are listed all the surveys that the current admin has created.
  - Purpose: this page offers the possibility to create a new survey or visualize the answers that the users gave to the survey created before.
- Route `/admin/add`:
  - Page content: this route contains the survey creation page.
  - Purpose: in this page an admin can create and customize a new survey. He can choose a title for the survey, add or remove a question, choose the type of question, insert a question title, add or remove choices for the multiple choice questions or switch the questions order.
- Route `/admin/surveys/:idS/answers`:
  - Page content: this page contains the answers givev by the users to a particular survey and you can switch from the answers of a user to the answers of another.
  - Purpose: the admin can inspect the responses that a survey has received. 
  - Param `:idS`: id of the selected survey.

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `admins` - contains id, email, name, hash
    > This table contains all the informations of the admins of the application, including the bcrypted password.
- Table `surveys` - contains id, title, admin
    > This table contains the informations of all the created surveys.
- Table `questions` - contains id, title, type, idS, min, max
    > This table contains the informations of all the created questions for every survey, including the type (0 = open question, 1 = multiple choice question) of question and the constraints (min, max).
- Table `choices` - contains id, title, idQ
    > This table contains the informations of all the differente choices for all the multiple choice questions (type = 1).
- Table `answers` - contains id, name, idS
    > This table contains the list of all the answers for every survey with the name of the person that has compiled that survey.
- Table `data_answers` -  contains id, data, idQ, idA
    > This table contains the informations for every answer to every question like the string that the client wrote in the open questions or, for the multiple choice questions, a string that is the concatenation of the ids of the choices that the client has selected.
 

## Main React Components

- `LoginForm` (in `LoginComponent.js`): this component offers a login form where a user can insert his username and password to login in the application.

- `AdminPage` (in `AdminPage.js`): this component contains a table with all the survey that the logged admin has created and here can inspect how many answers has received and can click on a button to inspect all the answers that a survey as received or can create a new survey by clicking on the + button placed at the bottom right.

- `Questionary` (in `FormCreationPage.js`): this component is used for the actual creation of a new survey. In this component an admin can choose a title for the survey, add or remove a question, choose the type of question, insert a question title, add or remove choices for the multiple choice questions or switch the questions order.

- `AnswersPage` (in `AnswersPage.js`): this component is used for visualization of the answers provided by the user to a particular survey, it also offers the possiblity to switch between the answers provided by different users to that survey.

- `GuestPage` (in `GuestPage.js`): this component contains a table listing all the created surveys by all the admins. There is also a button for every survey, that the user can click and be redirected to the compilation page.

- `CompileSurvey` (in `CompileSurvey.js`): this component is used for the compilation of a survey where a user can answer to the questions of the selected survey.


## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- User email: admin1@polito.it, password: password1 (plus any other requested info)
- User email: admin2@polito.it, password: password2 (plus any other requested info)
