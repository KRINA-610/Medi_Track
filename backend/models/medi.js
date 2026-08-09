const mongoose = require("mongoose");

const mediSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},

		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},

		medicineName: {
			type: String,
			required: true,
			trim: true,
		},

		dosage: {
			type: String,
			required: true,
			trim: true,
		},

		medicineTime: {
			type: String,
			required: true,
		},

		frequency: {
			type: String,
			enum: ["Once Daily", "Twice Daily", "Three Times Daily", "As Needed"],
			default: "Once Daily",
		},

		startDate: {
			type: Date,
			required: true,
		},

		endDate: {
			type: Date,
			required: true,
		},

		instructions: {
			type: String,
			default: "",
		},

		disease: {
			type: String,
			required: true,
			trim: true,
		},

		reminderStatus: {
			type: String,
			enum: ["Pending", "Taken", "Missed"],
			default: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

const Medi = mongoose.model("medi", mediSchema);

module.exports = Medi;