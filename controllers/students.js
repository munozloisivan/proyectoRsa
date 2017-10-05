var mongoose = require('mongoose');
var Student  = mongoose.model('Student');

//GET - Return all tvshows in the DB
exports.findAllStudents = function(req, res) {
    Student.find(function(err, students) {
        if(err) res.send(500, err.message);

        console.log('GET /students')
        res.status(200).jsonp(students);
    });
};

//GET - Return a Students with specified ID
exports.findStudentById = function(req, res) {
    Student.findById(req.params.id, function(err, student) {
        if(err) return res.send(500, err.message);

        console.log('GET /student/' + req.params.id);
        res.status(200).jsonp(student);
    });
};

//POST - Insert a new Student in the DB
exports.addStudent = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var student = new Student({
        nombre:    req.body.nombre,
        apellido: 	  req.body.apellido,
        edad:  req.body.edad,
        genero:   req.body.genero
    });

    student.save(function(err, student) {
        if(err) return res.status(500).send( err.message);
        res.status(200).jsonp(student);
    });
};

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
};