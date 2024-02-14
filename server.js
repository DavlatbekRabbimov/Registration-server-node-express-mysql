const db = require('./db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('./apps/app');
require('dotenv').config();

const {
    allEmptyFieldsError, userRegisterError, userNotFound,
    emailNotFound, passwordNotFound, existingUserError, authError, tableError, statusError, deleteError
} = require('./messages/errorMsg');
const {userRegisterSuccess, authSuccess, updateSuccess} = require('./messages/successMsg');
const {checkFields} = require('./checker/fieldsChecker');
const positions = ["-", "CEO", "Captain", "Office Manager"];

app.get('/positions', (req, res) => {
    res.json(positions);
});


app.post('/sign-up', async (req, res) => {
    try {
        const {username, position, email, password} = req.body;
        if (!username && !email && !position && !password) return res.status(400).json({message: allEmptyFieldsError});
        const error = checkFields(req, res, 'sign-up');
        if (error) return error;
        const existingUser = await db.User.findOne({where: {email}});
        if (existingUser) return res.status(400).json({message: existingUserError});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({
            username: username,
            position: position,
            email: email,
            password: hashedPassword,
            lastLogin: new Date(),
            status: 'Active'
        });
        res.status(201).json({message: userRegisterSuccess});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: userRegisterError});
    }
});

app.post('/sign-in', async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email && !password) return res.status(400).json({message: allEmptyFieldsError});
        const error = checkFields(req, res, 'sign-in');
        if (error) return error;
        const user = await db.User.findOne({where: {email}});
        if (!user) return res.status(400).json({message: emailNotFound});
        if (user.status === 'Blocked') return res.status(403).json({message: 'User blocked'});
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({message: passwordNotFound});
        const token = jwt.sign({username: user.username}, process.env.JWT_SECRET);
        res.status(201).json({token, username: user.username, message: authSuccess});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: authError});
    }
});

app.get('/table', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: tableError});
    }
});

app.post('/update-status', async (req, res) => {
    try {
        const {userId, status} = req.body;
        const user = await db.User.findOne({where: {id: userId}});
        if (user) {
            user.status = status;
            await user.save();
            res.json({message: updateSuccess});
        } else {
            res.status(400).json({message: userNotFound});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: statusError});
    }
});

app.post('/delete-user', async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await db.User.findOne({where: {id: userId}});
        if (user) {
            await user.destroy();
            res.json({message: 'Success: User deleted!'});
        } else {
            res.status(400).json({message: userNotFound});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: deleteError});
    }
});
