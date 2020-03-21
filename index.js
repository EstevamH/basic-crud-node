const express = require('express');
const server = express();

server.use(express.json());

const users = ['Lucas', 'Flávio', 'Rodrigo'];

server.use((req, res, next) => {
    console.log(`Método ${req.method}; URL: ${req.url}`);
    next();
})

function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({error: 'User name is required'});
    }

    next();
}

function checkUserInArray(req, res, next) {
    const user = users[req.params.index];

    if (!user) {
        return res.status(400).json({error: 'User does not exists'});
    }

    req.user = user;
    next();
}


server.get('/users', (req, res) => {
    res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
    res.send(req.user);
});

server.post('/users', checkUserExists , (req, res) => {
    const { name } = req.body;
    users.push(name);
    res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUserExists,  (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;
    res.send(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);
    return res.send();
});

server.listen(3000);