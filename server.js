require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');

//Import Routes
const authRoutes = require('./src/routes/auth.routes');
const issueRoutes = require('./src/routes/issues.routes');
const app = express();

//Middleware, origin should point to the frontend
app.use(cors({
    origin: 'http://localhost5173',
    credentials: true
}));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('./api/issues', issueRoutes);

//test route to check the server
app.get('/', (req, res) =>{
    res.send('Discors Issue Tracker API');
});

//Route error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Uh oh! Something broke")
});

const PORT = process.env.PORT || 5000;

//Sync db and start the server
sequelize.authenticate()
    .then(() => {
        console.log('Connected to database');
        app.listen(PORT, () => {
            console.log('Server Running on port ${PORT}');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database', err);
    });