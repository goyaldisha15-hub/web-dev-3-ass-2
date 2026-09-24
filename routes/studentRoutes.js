const express = require ('express');
const router = express.Router();
const students = require('../data/students');


router.get('/students', (req, res) => {
    res.status(200).json(students);
});