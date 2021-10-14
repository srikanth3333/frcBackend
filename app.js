var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var verifyUser = require("./routers/verifyUser");
var router = express.Router();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) 
{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/api/services', router);
router.post('/verifyUser', verifyUser.checkUserAvailability);

const env_port = process.env.PORT || 4000;
const server = http.createServer(app).listen(env_port, function(err)
{
	if (err) 
	{
		console.log(err);
  	} else 
  	{
		const host = server.address().address;
		const port = server.address().port;
		console.log(`Server listening on ${host}:${port}`);
  	}
});