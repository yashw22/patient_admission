const controller = require("../controllers/rfid.controller");

module.exports = function (app, io) {
    var nsp = io.of("/patientRFID");

    app.post("/rfid/scanpatientrfid", (req, res, next) => { req.nsp = nsp; next(); }, controller.scanPatientRFID);
    app.post("/rfid/assignbedtopatient",
        (req, res, next) => { req.nsp = nsp; next(); },
        controller.checkBedAlreadyAssigned,
        controller.assignBedToPatient);
};