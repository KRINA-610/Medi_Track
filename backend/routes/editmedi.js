const router = require("express").Router();
const Medi = require("../models/medi");

// Get single medicine
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medi.findById(req.params.id);

    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }

    res.status(200).send(medicine);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// ✅ POST → PUT કર્યું
router.put("/:id", async (req, res) => {
  try {
    const medicine = await Medi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }

    res.status(200).send(medicine);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;