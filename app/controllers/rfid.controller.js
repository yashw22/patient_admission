const db = require("../models");
const Patient = db.patient;

exports.checkBedAlreadyAssigned = (req, res, next) => {
    Patient.find({ bedID: req.body.bedID })
        .exec(function (err, beds) {
            if (err) { res.status(500).send({ message: err }); return; }
            else if (beds.length > 0) { req.nsp.emit("bedAlreadyAssigned", { message: "Trying to assign bed " + req.body.bedID + " to a patient which is already occupied." }); }
            else next();
        });
}

exports.assignBedToPatient = (req, res) => {
    Patient.findOneAndUpdate({ patientRFID: req.body.patientRFID },
        { bedID: req.body.bedID, bedOccupied: true },
        { new: true },
        function (err, patinet) {
            if (err) {
                console.log("MongoDB update err msg: " + err);
                res.status(500).send("MongoDB update err msg: " + err);
                return;
            }
            req.nsp.emit("assignBedToPatient", { patient_id: patinet._id, BedID: patinet.bedID });
            console.log("Bed " + patinet.bedID + " assigned to Patient " + patinet.patientName);
            res.status(200).send("Bed " + patinet.bedID + " assigned to Patient " + patinet.patientName);

        });
};

exports.scanPatientRFID = (req, res) => {
    req.nsp.emit("transferPatientRFID", { patientRFID: req.body.patientRFID });
    console.log("PatientRFID recieved. " + req.body.patientRFID);
    res.status(200).send("PatientRFID recieved. " + req.body.patientRFID);
}