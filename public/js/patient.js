import { HOST, PORT } from "../config.js";

var timeoutVar;
var scanningFlag = false, patientRFID = "";
var socket1 = io("/patientRFID"), socket2 = io("/bedID");

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
        $.ajax({
            type: 'POST',
            url: HOST + ":" + PORT + "/addpatient",
            data: PatientData,
            dataType: "text",
            success: function (resultData) {
                $("#staticBackdrop").modal('hide');
                patientRFID = "";
                $("#patientName").val("");
                $("#patientAge").val("");
                $("#patientID").val("");
                $("#scanRFIDButton").html("Scan for RFID");
                $("#scannedRFID").html("");
                fetchPatientDataJSON();
            }
        });
    }
});

function fetchPatientDataJSON() {
    fetch(HOST + ":" + PORT + "/getpatients")
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            $("#patientsList").empty();
            var dd = $("<div>").addClass("row gy-4").appendTo("#patientsList");
            for (var i = 0; i < data.length; i++) {
                var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
                var d2 = $("<div>").addClass("card h-100").appendTo(d1);
                var d3 = $("<div>").addClass("text-center").appendTo(d2);
                var d4 = $("<div>").addClass("card-body").appendTo(d2);
                $("<h3>").html(data[i].patientName).appendTo(d3);
                $("<p>").html("<b>Age</b>: " + data[i].patientAge).appendTo(d4);
                $("<p>").html("<b>Patient ID</b>: " + data[i].patientID).appendTo(d4);
                $("<p>").html("<b>Patient RFID</b>: " + data[i].patientRFID).appendTo(d4);
                // var bedIDtag = $("<p>").appendTo(d4).attr({ "id": "test" + i });
                var bedIDtag = $("<p>").appendTo(d4).attr({ "id": data[i].patientRFID + "-BedID" });
                if (data[i].bedID === "") bedIDtag.html("<b>Bed ID</b>: <i>**Not assigned**</i>");
                else bedIDtag.html("<b>Bed ID</b>: " + data[i].bedID);
            }
        })
}

$("#scanRFIDButton").on("click", function () {
    scanningFlag = true;
    $(this).html("Scanning...");
    timeoutVar = setTimeout(function (context) {
        $("#scanRFIDButton").html("Scan for RFID");
        $("#scannedRFID").html("No RFID detected!!!");
        scanningFlag = false;
    }, 10000);
});

socket1.on("transferPatientRFID", function (data) {
    if (scanningFlag == true) {
        patientRFID = data.patientRFID;
        $("#scanRFIDButton").html("Scan another RFID");
        $("#scannedRFID").html(patientRFID);
        clearTimeout(timeoutVar);
        scanningFlag = false;
    }
});
socket2.on("assignBedToPatient", function (data) {
    $("#" + data.patientRFID + "-BedID").html("<b>Bed ID</b>: " + data.BedID);
});