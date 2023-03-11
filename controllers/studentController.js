const studentModel = require('../models/studentData');
// const db= require('../db/connectDB')
const mysql = require('mysql2');
const config= require('../config');
const conn =  require('../config');

const getAllDetail = (req, res) => {

    studentModel.fetchAll((err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            res.json(result);
        }
    })
};


module.exports = { getAllDetail }