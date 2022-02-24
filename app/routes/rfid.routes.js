const controller = require("../controllers/rfid.controller");

module.exports = function (app, io) {
    var nsp_patientRFID = io.of("/patientRFID");
    var nsp_bedID = io.of("/bedID");

    app.post("/rfid/scanpatientrfid",
        (req, res, next) => { req.nsp = nsp_patientRFID; next(); },
        controller.scanPatientRFID);
    app.post("/rfid/assignbedtopatient",
        (req, res, next) => { req.nsp = nsp_bedID; next(); },
        controller.assignBedToPatient);
};