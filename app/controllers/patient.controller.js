const db = require("../models");
const Patient = db.patient;

exports.checkPatientRFID = (req, res, next) => {
    Patient.find({ patientRFID: req.body.patientRFID })
        .exec(function (err, patients) {
            if (err) { res.status(500).send({ message: err }); return; }
            else if (patients.length > 0) { res.status(400).send({ message: "RFID already in use." }); return; }
            else next();
        });
}

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

exports.deletePatient = (req, res) => {
    Patient.deleteOne({ _id: req.body.patient_ID })
        .exec(function (err) {
            if (err) { res.status(500).send({ message: err }); return; }
            console.log("Patient deleted.");
            res.status(200).send("Patient deleted");
        });
}