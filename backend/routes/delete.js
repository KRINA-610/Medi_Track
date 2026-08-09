const router = require("express").Router();
const Medi = require("../models/medi");

router.delete("/:id", async (req, res) => {
  try {
    const medicine = await Medi.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).send({
        message: "Medicine not found"
      });
    }

    res.status(200).send({
      message: "Medicine deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Internal Server Error"
    });
  }
});

module.exports = router;