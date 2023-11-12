const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema(
    {
        contract_addr: {
            type: String,
            required: [true, "Please add the contract address"],
        },

        nft_id: {
            type: String,
            required: [
                true,
                "Please add the nft id in the specified contract address",
            ],
        },

        address: {
            type: String,
            required: [true, "Please add the address"],
        },

        parent_address: {
            type: String,
            required: [true, "Please add the parent address"],
        },

        // Storage for the nft metadata
        metadata_url: {
            type: String,
            required: [true, "optional"],
        },

        // Storage for the json data (tree structure)
        state_url: {
            type: String,
            required: [true, "Please add the state URL"],
        },

        // json data (tree structure)
        state: {
            type: Object,
            required: [true, "Please add the state"],
        },
    },
    {
        timestamps: true,
    }
);

// Define a compound unique index
nftSchema.index({ contract_addr: 1, nft_id: 1 }, { unique: true });

const NFTModel = mongoose.model("nfts", nftSchema);

module.exports = NFTModel;
