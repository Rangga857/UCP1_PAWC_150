const express = require('express');
const todosRoutes = require('./routes/tododb.js');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts')

// pertemuan 7
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);

app.use(expressLayouts);

app.use(express.json());

app.use('/todos', todosRoutes);
app.set('view engine', 'ejs');
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { layout: 'layouts/main-layout.ejs' });
});


app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`);
});

app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM animals', (err, todos) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.render('todo', {
            layout: 'layouts/main-layout.ejs',
            animals: todos
        });
    });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
        res.redirect('/index');
    } else {
        res.send('Login gagal!');
    }
});