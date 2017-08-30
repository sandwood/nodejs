var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/signup/', function(req, res, next){
    return res.render('auth/signup');
})

router.post('/signup/', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    
    var user = User({
        username: username,
        password: password
    });
    
    user.save(function(err){
        if(err) return res.json(err);
        //signup process
        //flash message
        req.flash('success', 'Successfully created a user.');
        return res.redirect('/');
    });
})

router.get('/login/', function(req, res, next){
    return res.render('auth/login');
});

router.post('/login/', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    // validate : username, password
    User.authenticate(username, password, function(err, user){
        if(err) return res.json(err);
        if(!user){
            req.flash('error', 'User not found');
            return res.redirect('/login/');
        }
        req.session.user = user;
        req.flash('succes', 'login Successfully');
        
        return res.redirect('/');
    });
})
var authMiddleware = require('../middlewares/auth');
router.get('/mypage/', authMiddleware.loginRequiredMiddleware , function(req, res, next){
    return res.send(req.session.user.username);
});
module.exports = router;