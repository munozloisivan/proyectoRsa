//incluimos las dependencias que usaremos
var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
var path = require('path');

//Utils extra
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static('public'));

//Controllers y modelos
var RSACtrl = require('./controllers/RSA.js');

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//Example Route
/*var router = express.Router();
router.get('/', function(req, res) {
    res.send("Hello World!");
});
app.use(router);*/

//API Students Routes
var rsa = express.Router();
app.use('/rsa', rsa);

rsa.route('/pukey').get(RSACtrl.publicKey);
rsa.route('/redokey').get(RSACtrl.redoKey);

rsa.route('/send').post(RSACtrl.sendMensaje);
rsa.route('/sign').post(RSACtrl.signMensaje);
rsa.route('/webkeys').post(RSACtrl.webKeys);
rsa.route('/sendsecret').post(RSACtrl.sendSecret);
rsa.route('/getsecret').post(RSACtrl.getSecret);


/*students.route('/students/:id')
    .get(StudentsCtrl.findStudentById)
    .put(StudentsCtrl.updateStudent)
    .delete(StudentsCtrl.deleteStudent);
//*/

//Start server
app.listen(3000, function() {
    console.log("Server running on http://localhost:3000");
});