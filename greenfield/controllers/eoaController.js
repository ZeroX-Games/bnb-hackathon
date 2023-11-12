const asyncHandler = require("express-async-handler");
const EOAModel = require("../models/eoaModel");
const { createEOAURL, createAndUploadObject } = require("./utils/storageUtils");
const { augmentStateWithMetadata } = require("./utils/treeUtils");
const { create } = require("../models/nftModel");

//@desc Get all EOAs
//@route GET /api/eoa
//@access private
const getEOAs = asyncHandler(async (req, res) => {
    const EOAs = await EOAModel.find({});

    eoaStateList = [];
    for (const eoa of EOAs) {
        await augmentStateWithMetadata(eoa.state);
        eoaStateList.push(eoa.state);
    }
    res.status(200).json(eoaStateList);
});

//@desc Create New EOA
//@route POST /api/eoa
//@access private
const createEOA = asyncHandler(async (req, res) => {
    const { address } = req.body;
    if (!address) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }

    const CurrentEOA = await EOAModel.findOne({ address: address });

    if (CurrentEOA) {
        res.status(400);
        throw new Error("EOA already exists !");
    }

    try {
        const { jsonObject, stateUrl } = await createEOAURL(address);
        const EOA = await EOAModel.create({
            address,
            state: jsonObject,
            state_url: stateUrl,
        });
        res.status(201).json(EOA);
    } catch (error) {
        res.status(400);
        throw new Error("error during state URL creation", error);
    }
});

//@desc Get NFT
//@route GET /api/eoa/:address
//@access private
const getEOA = asyncHandler(async (req, res) => {
    const EOA = await EOAModel.findOne({ address: req.params.address });
    if (!EOA) {
        res.status(404);
        throw new Error("EOA not found");
    }

    await augmentStateWithMetadata(EOA.state);

    res.status(200).json(EOA.state);
});

//@desc Delete NFT
//@route DELETE /api/eoa/:address
//@access private
const deleteEOA = asyncHandler(async (req, res) => {
    const EOA = await EOAModel.findOne({ address: req.params.address });
    if (!EOA) {
        res.status(404);
        throw new Error("EOA not found");
    }
    await EOAModel.deleteOne({ address: req.params.address });
    res.status(200).json(EOA);
});

//@desc Delete NFTs
//@route DELETE /api/eoa/d/delete-all
//@access private
const deleteEOAs = asyncHandler(async (req, res) => {
    await EOAModel.deleteMany();
    res.status(200).json({ response: "all EOAs are deleted" });
});

module.exports = {
    getEOAs,
    createEOA,
    getEOA,
    deleteEOA,
    deleteEOAs,
};
