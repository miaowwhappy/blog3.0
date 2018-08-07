var express = require("express") 
var app = express();
var swig = require("swig");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var Cookies = require("cookies")
var User = require('./models/user')



/*bodyParser中间件要在路由之前引入，要不 req.body 接收的数据为undefined*/
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req,res,next){
	req.cookies = new Cookies(req,res);
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			User.findById(req.userInfo._id).then(function(userInfo){
               req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
               next();
			})
		}catch(e){
			next();
		}
		
	}else{
		next();
	}
	
});

app.use('/public',express.static(__dirname+'/public'));

app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({cache:false});


/*app.get('/',function(req,res,next){
	res.render('index.html');
});*/

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));




mongoose.connect('mongodb://127.0.0.1:27017/blog',function(err){
    if(err){
    	console.log("123");}
    else{
    	console.log("456");
    	app.listen(6000);
    	console.log('server started on port6000');
        }
    }
);
