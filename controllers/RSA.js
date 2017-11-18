var bigInt = require("big-integer");
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
//Generamos todos los valores cuando se arranca el servidor
var length = 512;
var id_server = "Servidor";
var id_client;
var p, q, n, phiN, e, d;
var e_client, n_client;

generateKeys();

//GET - Return Public Key
exports.publicKey = function(req, res) {
        console.log('GET /pukey');
        res.status(200).send(JSON.stringify({ e: e, n: n, id: id_server }));
};

//Get - Reset Keys
exports.redoKey = function(req, res) {
    console.log('GET /redoKey');
    generateKeys();
    res.status(200).jsonp({'status': "Las claves se han generado de nuevo"});
};

//POST - Recibir claves del cliente
exports.webKeys = function(req, res) {
    console.log('Keys del cliente');
    console.log(req.body);
    e_client = req.body.e;
    n_client = req.body.n;
}

//POST - Enviar y desencriptar mensaje
exports.sendMensaje = function(req, res) {
    console.log('Descifrar');
    console.log(req.body);
    id_client = req.body[0].A;
    var decipher = bigInt(req.body[2].cipher).modPow(d, n);
    //var msghash = req.body[3];
    var msj = decipher.toString(16);
    var hash = bigInt(req.body[3].Po).modPow(e_client, n_client);
    var hexahash = hash.toString(16);
    console.log("Descifrado big-integer: " + decipher.toString());
    console.log("Mensaje original: " + hex_to_ascii(msj));
    console.log("Hash_recibido: " + hexahash);
    var data = ([{"A": id_client}, {"B": id_server}, {"cipher": req.body[2].cipher}]);
    var calcpo = CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
    console.log("Hash calculado: " + calcpo);
    res.status(200).jsonp({'status': "Mensaje recibido"});
};

//POST - Enviar y firmar mensaje
exports.signMensaje = function(req, res) {
    console.log('Firmar');
    console.log(req.body);
    id_client = req.body[0].A;
    var signed = bigInt(req.body[2].blinded).modPow(d, n);
    console.log("Mensaje firmado: " + signed.toString());
    var dataObj = ([{"B": id_server}, {"A": id_client}, {"signed": signed}, {'status': "Mensaje firmado"}]);
    res.status(200).jsonp(dataObj);
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
