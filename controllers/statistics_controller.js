var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function (req, res, next) {
    var statistics = {
        numPreguntas: 0,
        numComentarios: 0,
        comentariosPorPregunta: 0,
        numPreguntasNoComentadas: 0,
        numPreguntasComentadas: 0
    };

    models.Quiz.findAll({
        include: [{
            model: models.Comment
        }]
    }).then(function (quizes) {
        if (quizes.length > 0) {
            statistics.numPreguntas = quizes.length;
            var numPreguntasComentadas = 0;
            var numComentarios = 0;
            for (var i in quizes) {
                if (quizes[i].Comments.length > 0) {
                    numPreguntasComentadas++;
                    numComentarios += quizes[i].Comments.length;
                }
            }
            statistics.numComentarios = numComentarios;
            statistics.comentariosPorPregunta = (statistics.numComentarios / statistics.numPreguntas).toFixed(2);
            statistics.numPreguntasComentadas = numPreguntasComentadas;
            statistics.numPreguntasNoComentadas = statistics.numPreguntas - statistics.numPreguntasComentadas;
        }
        res.render('statistics/show', {statistics: statistics, errors: []});
    }).catch(function (error) {
        next(error);
    });
};

