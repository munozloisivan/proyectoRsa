var bigInt = require("big-integer");
//Generamos todos los valores cuando se arranca el servidor
var length = 512;
var p, q, n, phiN, e, d;

generateKeys();

//GET - Return Public Key
exports.publicKey = function(req, res) {
        console.log('GET /pukey');
        res.status(200).send(JSON.stringify({ e: e, n: n }));
};

//Get - Reset Keys
exports.redoKey = function(req, res) {
    console.log('GET /redoKey');
    generateKeys();
    res.status(200).jsonp({'status': "Las claves se han generado de nuevo"});
};


//POST - Insert a new Student in the DB
exports.sendMensaje = function(req, res) {
    console.log('Descifrar');
    console.log(req.body);
    var decipher = bigInt(req.body.cipher).modPow(d, n);
    var msj = decipher.toString(16);
    console.log("Descifrado big-integer: " + decipher.toString());
    console.log("Mensaje original: " + hex_to_ascii(msj));
    res.status(200).jsonp({'status': "Mensaje recibido"});
};

exports.signMensaje = function(req, res) {
    console.log('Firmar');
    console.log(req.body);
    var signed = bigInt(req.body.blinded).modPow(d, n);
    console.log("Mensaje firmado: " + signed.toString());
    res.status(200).jsonp({"signed": signed, 'status': "Mensaje firmado"});
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

function  generateKeys() {
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
    e = bigInt.randBetween((bigInt(2).pow(length/2)), bigInt(phiN));

//Mientras e no sea primo y coprimo de phiN lo volvemos a generar
    while ((!bigInt(e).isPrime())&&(bigInt.lcm(e, phiN) != 1)){
        e = bigInt.randBetween((bigInt(2).pow(length/2)), bigInt(phiN));
    }

//d (exponente privado) tiene que ser el multiplicador inverso de e mod phiN
    d = bigInt(e).modInv(phiN);
}