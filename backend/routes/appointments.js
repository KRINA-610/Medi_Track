const router = require("express").Router();
const Appointment = require("../models/appointment");
const { User } = require("../models/user");

// Create appointment
router.post("/", async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            notes,
        } = req.body;

        const patient = await User.findOne({
            _id: patientId,
            role: "patient",
        });

        if (!patient) {
            return res.status(404).send({
                message: "Patient not found",
            });
        }

        const doctor = await User.findOne({
            _id: doctorId,
            role: "doctor",
        });

        if (!doctor) {
            return res.status(404).send({
                message: "Doctor not found",
            });
        }

        const appointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            notes,
        });

        await appointment.save();

        res.status(201).send({
            message: "Appointment created successfully",
            appointment,
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

// Get patient's appointments
router.get("/patient/:patientId", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patientId: req.params.patientId,
        })
            .populate("doctorId", "firstName lastName email")
            .sort({ appointmentDate: 1 });

        res.status(200).send(appointments);

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

// Get doctor's appointments
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctorId: req.params.doctorId,
        })
            .populate("patientId", "firstName lastName email")
            .sort({ appointmentDate: 1 });

        res.status(200).send(appointments);

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

module.exports = router;