var bigInt = require("big-integer");

//Generamos todos los valores cuando se arranca el servidor
var length = 512;

var p = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));
var q = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));

while (!bigInt(p).isPrime()){
    p = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));
}

while (!bigInt(q).isPrime()){
    q = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));
}

//n = p·q y phiN es (p-1)(q-1)
var n = bigInt(p).multiply(q);
var phiN = bigInt(bigInt(p).prev()).multiply(bigInt(q).prev());

//Random menor que Phi de N
var e = bigInt.randBetween("1e90", bigInt(phiN));

//Mientras e no sea primo y coprimo de phiN lo volvemos a generar
while ((!bigInt(e).isPrime())&&(bigInt.lcm(e, phiN) != 1)){
    e = bigInt.randBetween("1e90", bigInt(phiN));
}

//d (exponente privado) tiene que ser el multiplicador inverso de e mod phiN
var d = bigInt(e).modInv(phiN);

//GET - Return Public Key
exports.publicKey = function(req, res) {
        console.log('GET /pukey');
        res.status(200).send(JSON.stringify({ e: e, n: n }));
};

//Get - Reset Keys
exports.redoKey = function(req, res) {
    console.log('GET /redoKey');

    p = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));
    q = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));

    while (!bigInt(p).isPrime()){
        p = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));
    }

    while (!bigInt(q).isPrime()){
        q = bigInt.randBetween(bigInt(2).pow((length/2) - 1), bigInt(bigInt(2).pow(length/2)).minus(1));
    }

//n = p·q y phiN es (p-1)(q-1)
    n = bigInt(p).multiply(q);
    phiN = bigInt(bigInt(p).prev()).multiply(bigInt(q).prev());

//Random menor que Phi de N
    e = bigInt.randBetween("1e90", bigInt(phiN));

//Mientras e no sea primo y coprimo de phiN lo volvemos a generar
    while ((!bigInt(e).isPrime())&&(bigInt.lcm(e, phiN) != 1)){
        e = bigInt.randBetween("1e90", bigInt(phiN));
    }

//d (exponente privado) tiene que ser el multiplicador inverso de e mod phiN
    d = bigInt(e).modInv(phiN);
    res.status(200).jsonp("Las claves se han generado de nuevo");
};


//POST - Insert a new Student in the DB
exports.sendMensaje = function(req, res) {
    console.log('POST');
    console.log(req.body);
    var decipher = bigInt(req.body.cipher).modPow(d, n);
    var msj = decipher.toString(16);
    console.log(decipher.toString());
    console.log(msj);
    console.log(hex_to_ascii(msj));
    res.status(200).jsonp("Mensaje recibido");
};

function hex_to_ascii(str1)
{
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
/*
//PUT - Update a register already exists
exports.updateStudent = function(req, res) {
    Student.findById(req.params.id, function(err, student) {
        student.nombre = req.body.nombre;
        student.apellido = req.body.apellido;
        student.edad = req.body.edad;
        student.genero  = req.body.genero;

        student.save(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(student);
        });
    });
};

//DELETE - Delete a Student specified ID
exports.deleteStudent = function(req, res) {
    Student.findById(req.params.id, function(err, student) {
        student.remove(function(err) {
            if(err) return res.status(500).send(err.message);
            res.status(200).send();
        })
    });
};*/