module.exports = function(err, req, res, next){
    //log the exceptions
    res.status(500).send('Something failed.');
}