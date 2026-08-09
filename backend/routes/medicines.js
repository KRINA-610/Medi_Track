const Medi = require("../models/medi");
const { User } = require("../models/user");
const router = require("express").Router();

// Add medicine
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      medicineName,
      dosage,
      medicineTime,
      frequency,
      startDate,
      endDate,
      instructions,
      disease,
    } = req.body;

    // Check patient exists
    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).send({
        message: "Patient not found",
      });
    }

    // Check doctor exists
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
      });
    }

    const medicine = new Medi({
      patientId,
      doctorId,
      medicineName,
      dosage,
      medicineTime,
      frequency,
      startDate,
      endDate,
      instructions,
      disease,
    });

    await medicine.save();

    res.status(201).send({
      message: "Medicine added successfully",
      medicine,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;