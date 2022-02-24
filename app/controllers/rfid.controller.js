const db = require("../models");
const Patient = db.patient;

exports.assignBedToPatient = (req, res) => {
    var fetchedBedID = req.body.bedID,
        fetchedPatientRFID = req.body.patientRFID;

    Patient.updateOne({ patientRFID: fetchedPatientRFID }, { bedID: fetchedBedID }, function (err, docs) {
        if (err) {
            console.log("MongoDB update err msg: " + err);
            res.send("MongoDB update err msg: " + err);
            return;
        }
        req.nsp.emit("assignBedToPatient", { patientRFID: fetchedPatientRFID, BedID: fetchedBedID });
        console.log("Bed " + fetchedBedID + " assigned to Patient " + fetchedPatientRFID);
        res.status(200).send("Bed " + fetchedBedID + " assigned to Patient " + fetchedPatientRFID);

    });
};

exports.scanPatientRFID = (req, res) => {
    req.nsp.emit("transferPatientRFID", { patientRFID: req.body.patientRFID });
    console.log("PatientRFID recieved. " + req.body.patientRFID);
    res.status(200).send("PatientRFID recieved. " + req.body.patientRFID);
}