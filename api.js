const express = require('express');
const Users = require('./user.controller');
const mongoose = require('mongoose');
const app = express();
const { Auth, isAuthenticated } = require('./auth.controller')
require('dotenv').config();


app.use(express.json());

mongoose.connect(process.env.MONGO_URI.replace('MONGO_USER', process.env.MONGO_USER).replace('MONGO_PW', process.env.MONGO_PW));


app.get('/users', isAuthenticated, Users.list)
app.get('/users/:id', isAuthenticated, Users.get)
app.post('/users', isAuthenticated, Users.create)
app.put('/users/:id', isAuthenticated, Users.update)
app.patch('/users/:id', isAuthenticated, Users.update)
app.delete('/users/:id', isAuthenticated, Users.destroy)

app.post('/login', Auth.login)
app.post('/register', Auth.register)


app.use(express.static('app'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get('*', (req, res) => {
    res.status(404).send(`This page doesn't exist'`)
})
/* 
    This is not neccesary because its not very useful for a regular user.
*/
// app.post('*', (req, res) => {
//     res.status(404).send(`This page doesn't exist`)
// })



app.listen(process.env.PORT, () => {
    console.log('Starting App!');
});