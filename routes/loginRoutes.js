const express = require('express');
const router = express.Router();
const passport = require('passport');

// gets and displays a login page
router.get('/', (req, res) => {
    res.render('login', { title: 'Login form' })
})

// checks username and password using passport
router.post('/', passport.authenticate('local', {failureRedirect: '/login'}), (req,res) =>{
    req.session.user = req.user;
    res.redirect('/employee');
})
module.exports = router;