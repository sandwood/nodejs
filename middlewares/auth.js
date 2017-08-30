module.exports.loginRequiredMiddleware = function(req, res, next){
    if(!req.session.user){
        req.flash('err','login required');
        return res.redirect('/');
    }
}