const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const router = express.Router();

router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) return res.status(500).send('Error registering user');
            res.redirect('/login');
        });
    });
});

router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'layouts/main-layout'
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Error fetching user');
        if (results.length === 0) return res.status(400).send('User not found');

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).send('Error checking password');
            if (!isMatch) return res.status(401).send('Incorrect password');

            req.session.userId = results[0].id;
            res.redirect('/');
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layouts/main-layout'
    });
});


module.exports = router;