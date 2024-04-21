const User = require('../models/User');
const jwt = require('jsonwebtoken');

function handleErrors(err) {
    let errors = { username: '', password: '' };
    if (err.message === 'Incorrect username') {
        errors.username = 'user not registered'
    }
    if (err.message === 'Incorrect password') {
        errors.password = 'incorrect password'
    }
    if (err.code === 11000) {
        if (err.keyValue.username) {
            errors.username = "username already exists";
        }
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 30 * 24 * 60 * 60;

function createToken(id, username) {
    return jwt.sign({ id, username }, 'jebejemfnewwlqksaoksjk', { expiresIn: maxAge });
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id, user.username);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.profile_get = (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Token not found' })
    }
    jwt.verify(token, 'jebejemfnewwlqksaoksjk', {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        res.json(info);
    })

}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id, user.username);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {

    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

}

