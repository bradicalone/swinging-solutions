var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var cookie = require('cookie');
var request = require('request-promise');
//JSON data to send into HTML
var data = require('../files/data');

/* GET home page. */
// router.get('/app', function(req, res, next) {
//   res.render('app', { title: 'Express' });
// });

router.get('/', function(req, res, next){
	res.render('index', {data: data})
})


router.get('/contact', function (req, res, next) {
	console.log("req query: ", req.url);
    let shop = req.url;
    // res.render('app', { shop: shop });
    res.render('contact', { shop: shop});
});


module.exports = router;
