const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},

		lastName: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			required: true,
		},

		role: {
			type: String,
			enum: ["doctor", "patient"],
			default: "patient",
			required: true,
		},
		age: {
			type: Number,
			default: null,
		},

		gender: {
			type: String,
			enum: ["Male", "Female", "Other", null],
			default: null,
		},

		phone: {
			type: String,
			default: "",
			trim: true,
		},

		address: {
			type: String,
			default: "",
			trim: true,
		},

		// Only set for patients — links them to the doctor who added them.
		assignedDoctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			default: null,
		},
	},
	{ timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			role: this.role,
		},
		process.env.JWTPRIVATEKEY,
		{
			expiresIn: "7d",
		}
	);

	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string()
			.required()
			.label("First Name"),

		lastName: Joi.string()
			.required()
			.label("Last Name"),

		email: Joi.string()
			.email()
			.required()
			.label("Email"),

		password: passwordComplexity()
			.required()
			.label("Password"),

		role: Joi.string()
			.valid("doctor", "patient")
			.default("patient")
			.label("Role"),

		assignedDoctorId: Joi.string()
			.allow(null, "")
			.label("Assigned Doctor"),

		age: Joi.number().allow(null, "").label("Age"),
		gender: Joi.string().valid("Male", "Female", "Other").allow(null, "").label("Gender"),
		phone: Joi.string().allow("").label("Phone"),
		address: Joi.string().allow("").label("Address"),
	})
		;

	return schema.validate(data);
};

module.exports = { User, validate };
