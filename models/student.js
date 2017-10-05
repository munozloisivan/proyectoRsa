exports = module.exports = function (app, mongoose) {

    var studentSchema = new mongoose.Schema({
        nombre:    { type: String },
        apellido:  { type: String },
        edad:     { type: Number },
        genero:    { type: String, enum:
            ['Hombre', 'Mujer']
        }
    });

    mongoose.model("Student", studentSchema)

};

