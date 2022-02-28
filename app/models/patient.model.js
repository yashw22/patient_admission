const mongoose = require("mongoose");

const Patient = mongoose.model(
    "Patient",
    new mongoose.Schema({
        patientName: String,
        patientAge: Number,
        patientID: String,
        patientRFID: { type: String, unique: true, },
        bedID: { type: String, unique: true, },
        bedOccupied: { type: Boolean, default: false, },
    },
        { timestamps: true }
    )
)

module.exports = Patient;