var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexistemail = userModule.findOne({email:email});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
     return res.render('signup', { title: 'Simple Wep Api', msg:'email already exist' });
    }
    next();
  });
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Wep Api', msg:''});
});

router.post('/', function(req, res, next) {
  var contact = req.body.contact;
  var password = req.body.password;
  var checkUser = userModule.findOne({contact:contact});
  checkUser.exec((err, data)=>{
    if (err) throw err;

    var getUserID= data._id;
    var getPassword= data.password;
    if(bcrypt.compareSync(password,getPassword)){
      var token = jwt.sign({ UserID: getUserID }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', contact);
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Simple Wep Api', msg:'login failed' });
    }
    
  });
  
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Simple Wep Api', msg:'' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Simple Wep Api', msg:'' });
});

router.post('/signup',checkEmail, function(req, res, next) {

  var firstname =  req.body.firstname;
  var lastname =  req.body.lastname;
  var contact = req.body.contact
  var email =  req.body.email;
  var password =  req.body.password;
  var confpassword =  req.body.confpassword;

  if(password != confpassword){
    res.render('signup', { title: 'simple web API', msg:'passwordword not matching' });
  }else{
      password=bcrypt.hashSync(req.body.password,10);
  var userDetails = new userModule({
    firstname: firstname,
    lastname: lastname,
    contact: contact,
    email:email,
    password: password
  });

  console.log(userDetails);
  userDetails.save((err,doc)=>{
    if(err) throw err;
    res.render('signup', { title: 'simple web API', msg:'Registered Successfully' });
  });
}


  res.render('signup', { title: 'Simple Wep Api' });
});

module.exports = router;

