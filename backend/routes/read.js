const router = require("express").Router();
const Medi = require("../models/medi");

router.get("/:id", async (req, res) => {
  try {
    const medicines = await Medi.find({
      patientId: req.params.id
    });

    res.status(200).send(medicines);

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Internal Server Error"
    });
  }
});

module.exports = router;