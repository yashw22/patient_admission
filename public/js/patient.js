import { HOST, PORT } from "../config.js";

var timeoutVar;
var scanningFlag = false, patientRFID = "";
var socket = io("/patientRFID");

fetchPatientDataJSON();

$("#submitPatientDataButton").on("click", function () {
    var PatientData = {
        "patientName": $("#patientName").val(),
        "patientAge": $("#patientAge").val(),
        "patientID": $("#patientID").val(),
        "patientRFID": patientRFID,
    }

    if (PatientData.patientName === "" || PatientData.patientAge === "" || PatientData.patientID === "") {
        alert('Please enter all fields.');
        return false;
    } else if (PatientData.patientRFID === "") {
        alert('Please scan patient\'s RFID.');
        return false;
    } else {
        $.ajax({ type: 'POST', url: HOST + ":" + PORT + "/addpatient", data: PatientData, dataType: "text" })
            .done(function (resultData) {
                $("#staticBackdrop").modal('hide');
                patientRFID = "";
                $("#patientName").val("");
                $("#patientAge").val("");
                $("#patientID").val("");
                $("#scanRFIDButton").html("Scan for RFID");
                $("#scannedRFID").html("");
                fetchPatientDataJSON();
            }).fail(function (err) {
                if (err.status == 400) $("#RFIDUseStatus").html(JSON.parse(err.responseText).message);
            });
    }
});

$("#scanRFIDButton").on("click", function () {
    scanningFlag = true;
    $(this).html("Scanning...");
    $("#scannedRFID").html("");
    $("#RFIDUseStatus").html("");
    timeoutVar = setTimeout(function (context) {
        $("#scanRFIDButton").html("Scan for RFID");
        $("#scannedRFID").html("No RFID detected!!!");
        scanningFlag = false;
    }, 10000);
});

function fetchPatientDataJSON() {
    fetch(HOST + ":" + PORT + "/getpatients")
        .then(res => res.json())
        .then(data => {
            $("#patientsList").empty();
            var dd = $("<div>").addClass("row gy-4").appendTo("#patientsList");
            for (var i = 0; i < data.length; i++) {
                var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
                var d2 = $("<div>").addClass("card h-100").attr({ "id": "patient_id-" + data[i]._id }).appendTo(d1);
                var d3 = $("<div>").addClass("text-center").appendTo(d2);
                $("<h3>").html(data[i].patientName).appendTo(d3);
                var d4 = $("<div>").addClass("card-body").appendTo(d2);
                $("<p>").html("<b>Age</b>: " + data[i].patientAge).appendTo(d4);
                $("<p>").html("<b>Patient ID</b>: " + data[i].patientID).appendTo(d4);
                $("<p>").html("<b>Patient RFID</b>: " + data[i].patientRFID).appendTo(d4);

                var bedIDtag = $("<p>").addClass("bedIDtag").appendTo(d4);
                if (!data[i].bedOccupied) bedIDtag.html("<b>Bed ID</b>: <i>**Not assigned**</i>");
                else bedIDtag.html("<b>Bed ID</b>: " + data[i].bedID);

                var d5 = $("<div>").css("text-align", "right").appendTo(d4);
                $("<button>").addClass("btn btn-danger").html("Delete").attr({ "data-patient_id": data[i]._id })
                    .on("click", function () { deletePatientBtn($(this).data("patient_id")); })
                    .appendTo(d5);
            }
        })
}

function deletePatientBtn(id) {
    var PatientData = { patient_ID: id, };
    $.ajax({ type: 'DELETE', url: HOST + ":" + PORT + "/deletepatient", data: PatientData, dataType: "text" })
        .done(function (resultData) { fetchPatientDataJSON(); })
        .fail(function (err) { alert("Unable to delete."); });
};

socket.on("transferPatientRFID", function (data) {
    if (scanningFlag == true) {
        patientRFID = data.patientRFID;
        $("#scanRFIDButton").html("Scan another RFID");
        $("#scannedRFID").html(patientRFID);
        clearTimeout(timeoutVar);
        scanningFlag = false;
    }
});
socket.on("assignBedToPatient", function (data) {
    $("#patient_id-" + data.patient_id).find("p.bedIDtag").html("<b>Bed ID</b>: " + data.BedID);
});
socket.on("bedAlreadyAssigned", function (data) { alert(data.message); });