'use strict'

const sqlite = require('sqlite3');

const db = new sqlite.Database('database.db', (err) => {
    if (err) {
        throw err;
    }
});


exports.addSurvey = (survey) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys(title) VALUES(?)';
        db.run(sql, [survey.title], function(err){
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.addQuestion = (question, idS) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO questions(title, type, idS) VALUES(?,?,?)';
        db.run(sql, [question.title, question.type, idS], function(err){
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};


exports.addChoice = (choice, idQ) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO choices(title, idQ) VALUES(?,?)';
        db.run(sql, [choice.choiceTitle, idQ], function(err){
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.getSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys';
        db.all(sql, [], (err,rows) => {
            if(err) {
                reject(err);
                return;
            }
            const surveys = rows.map((s) => ({id: s.id, title: s.title}));
            
            resolve(surveys);
        });
    });
};

exports.getQuestions = (idS) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questions WHERE idS=?';
        db.all(sql, [idS], (err,rows) => {
            if(err) {
                reject(err);
                return;
            }
            const questions = rows.map((q) => ({id: q.id, title: q.title, type: q.type}));
            
            resolve(questions);
        });
    });
};

exports.getChoices = (idQ) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM choices WHERE idQ=?';
        db.all(sql, [idQ], (err,rows) => {
            if(err) {
                reject(err);
                return;
            }
            const choices = rows.map((c) => ({id: c.id, choiceTitle: c.title}));
            resolve(choices);
        });
    });
};