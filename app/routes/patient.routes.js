const controller = require("../controllers/patient.controller");

module.exports = function (app) {
    app.get("/getpatients", controller.getPatients);
    app.post("/addpatient", controller.checkPatientRFID, controller.addPatient);
    app.delete("/deletepatient", controller.deletePatient);
};