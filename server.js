const db = require('./db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('./apps/app');
require('dotenv').config();
const errors = require('./messages/error.msg');
const successes = require('./messages/success.msg');
const {checkFields} = require('./checker/fields.checker');
const positions = ["-", "CEO", "Captain", "Office Manager"];

const getUserById = (userId) => {
    return db.User.findOne({where: {id: userId}});
}

const getUserByEmail = (email) => {
    return db.User.findOne({where: {email}});
}

app.get('/positions', (req, res) => {
    res.json(positions);
});

app.post('/sign-up', async (req, res) => {
    try {
        const {username, position, email, password} = req.body;
        const emptyFields = !username && !email && !position && !password;
        if (emptyFields) return res.status(400).json({message: errors.allEmptyFields});

        const error = checkFields(req, res, 'sign-up');
        if (error) return error;

        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({message: errors.existingUser});

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.User.create({
            username: username,
            position: position,
            email: email,
            password: hashedPassword,
            lastLogin: new Date(),
            status: 'Active'
        });
        res.status(201).json({message: successes.userRegister});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: errors.userRegister});
    }
});

app.post('/sign-in', async (req, res) => {
    try {
        const {email, password} = req.body;
        const emptyFields = !email && !password;
        if (emptyFields) return res.status(400).json({message: errors.allEmptyFields});

        const error = checkFields(req, res, 'sign-in');
        if (error) return error;

        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({message: errors.notFound('Email')});
        if (user.status === 'Blocked') return res.status(403).json({message: errors.blocked});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({message: errors.notFound('Password')});

        const token = jwt.sign({username: user.username}, process.env.JWT_SECRET);
        res.status(201).json({token, username: user.username, message: successes.authSuccess});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: errors.authError});
    }
});

app.get('/table', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: errors.tableError});
    }
});

app.post('/update-status', async (req, res) => {
    try {
        const {userId, status} = req.body;
        const user = await getUserById(userId);
        if (user) {
            user.status = status;
            await user.save();
            res.json({message: successes.updateSuccess});
        } else {
            res.status(400).json({message: errors.notFound('User')});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: errors.statusError});
    }
});

app.post('/delete-user', async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await getUserById(userId);
        if (user) {
            await user.destroy();
            res.json({message: errors.deleteError});
        } else {
            res.status(400).json({message: errors.notFound('User')});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: errors.deleteError});
    }
});

