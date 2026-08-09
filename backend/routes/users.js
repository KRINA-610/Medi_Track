const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);

		if (error) {
			return res
				.status(400)
				.send({ message: error.details[0].message });
		}

		const user = await User.findOne({
			email: req.body.email,
		});

		if (user) {
			return res
				.status(409)
				.send({
					message: "User with given email already exists!",
				});
		}

		const salt = await bcrypt.genSalt(
			Number(process.env.SALT)
		);

		const hashPassword = await bcrypt.hash(
			req.body.password,
			salt
		);

		const newUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashPassword,
			role: req.body.role || "patient",
			// Only patients get linked to the doctor who created them.
			assignedDoctorId:
				req.body.role === "patient"
					? req.body.assignedDoctorId || null
					: null,
		});

		await newUser.save();

		res.status(201).send({
			message: "User created successfully",
		});

	} catch (error) {
		console.log(error);

		res.status(500).send({
			message: "Internal Server Error",
		});
	}
});

// Get all patients assigned to a doctor
router.get("/patients/:doctorId", async (req, res) => {
	try {
		const patients = await User.find({
			role: "patient",
			assignedDoctorId: req.params.doctorId,
		}).select("firstName lastName email createdAt");

		res.status(200).send(patients);

	} catch (error) {
		console.log(error);

		res.status(500).send({
			message: "Internal Server Error",
		});
	}
});
// Update patient
router.put("/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		).select("-password");

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		res.status(200).send(user);

	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Delete patient
router.delete("/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		res.status(200).send({ message: "Patient deleted successfully" });

	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});
module.exports = router;
