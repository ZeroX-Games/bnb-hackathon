const { json } = require("express");
const mongoose = require("mongoose");

const eoaSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: [true, "Please add the address"],
            unique: [true, "Address already taken"],
        },

        // json data (tree structure)
        state: {
            type: Object,
            required: [true, "Please add the state"],
        },

        // Storage for the json data (tree structure)
        state_url: {
            type: String,
            required: [true, "Please add the URL"],
        },
    },
    {
        timestamps: true,
    }
);

const EOAModel = mongoose.model("eoas", eoaSchema);

module.exports = EOAModel;
