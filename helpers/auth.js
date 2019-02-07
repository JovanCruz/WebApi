module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.ensureAuthenticated){
            return next();
        }
        res.redirect('/login');
    }
}