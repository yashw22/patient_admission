const db = require("../models");
const Patient = db.patient;

exports.addPatient = (req, res) => {
    const patient = new Patient({
        patientName: req.body.patientName,
        patientAge: req.body.patientAge,
        patientID: req.body.patientID,
        patientRFID: req.body.patientRFID,
    });
    patient.save((err, patient_res) => {
        if (err) { res.status(500).send({ message: err }); return; }
        console.log("New patient inserted: " + req.body.patientName);
        res.status(200).send("New patient inserted: " + req.body.patientName);
    });
};

exports.getPatients = (req, res) => {
    Patient.find({})
        .exec(function (err, patients) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Patient list sent.");
            res.status(200).send(patients);
        });
}