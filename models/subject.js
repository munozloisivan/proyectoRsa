exports = module.exports = function (app, mongoose) {

    var subjectSchema = new mongoose.Schema({
        nombre:    { type: String },
        tipo:  { type: String, enum:
            ['Obligatoria', 'Optativa']
        },
        estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref:'Student' }]
    });

    mongoose.model("Subject", subjectSchema)

};