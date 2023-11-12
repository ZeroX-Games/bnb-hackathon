const asyncHandler = require("express-async-handler");
const axios = require("axios");
const NFTModel = require("../models/nftModel");
const EOAModel = require("../models/eoaModel");
const { get } = require("mongoose");
const { createNFTURL } = require("./utils/storageUtils");
const {
    getEOAFrom,
    getParentList,
    removeFromAccount,
    addToEOA,
    augmentStateWithMetadata,
} = require("./utils/treeUtils");

//@desc Get NFT
//@route GET /api/tba/:address
//@access private
const getNFT = asyncHandler(async (req, res) => {
    const NFT = await NFTModel.findOne({
        $and: [{ address: req.params.address }],
    });

    if (!NFT) {
        res.status(404);
        throw new Error("NFT not found");
    }

    await augmentStateWithMetadata(NFT.state);

    res.status(200).json(NFT.state);
});

//@desc Get all NFTs
//@route GET /api/tba
//@access private
const getNFTs = asyncHandler(async (req, res) => {
    const NFTs = await NFTModel.find({});

    nftStateList = [];
    for (const nft of NFTs) {
        await augmentStateWithMetadata(nft.state);
        nftStateList.push(nft.state);
    }
    res.status(200).json(nftStateList);
});

//@desc Create New NFT
//@route POST /api/nft/mint
//@access private
const createNFT = asyncHandler(async (req, res) => {
    const { contract_addr, nft_id, metadata_url } = req.body;
    if (!contract_addr || !nft_id || !metadata_url) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }

    const CurrentNFT = await NFTModel.findOne({
        $and: [{ contract_addr: contract_addr }, { nft_id: nft_id }],
    });

    if (CurrentNFT) {
        res.status(400);
        throw new Error("NFT already exists !");
    }

    try {
        const { jsonObject, stateUrl } = await createNFTURL(
            contract_addr,
            nft_id
        );
        const NFT = await NFTModel.create({
            contract_addr: contract_addr,
            nft_id: nft_id,
            address: "NULL",
            parent_address: "NULL",
            state: jsonObject,
            state_url: stateUrl,
            metadata_url: metadata_url,
        });

        res.status(201).json(NFT);
    } catch (error) {
        res.status(400);
        throw new Error("error during URL creation", error);
    }
});

//@desc Get NFT Metadata
//@route GET /api/nft/:contract_addr/:nft_id
//@access private
const getNFTInfo = asyncHandler(async (req, res) => {
    const NFT = await NFTModel.findOne({
        $and: [
            { contract_addr: req.params.contract_addr },
            { nft_id: req.params.nft_id },
        ],
    });

    if (!NFT) {
        res.status(404);
        throw new Error("NFT not found");
    }

    const metadataResponse = await axios.get(NFT.metadata_url);

    // Check if the request was successful (status code 2xx)
    if (metadataResponse.status >= 200 && metadataResponse.status < 300) {
        res.status(200).json(metadataResponse.data);
    } else {
        res.status(metadataResponse.status);
        throw new Error(
            `Failed to fetch metadata. Status: ${metadataResponse.status}`
        );
    }
});

//@desc Update NFT
//@route PUT /api/tba/:contract_addr/:nft_id
//@access private
const tbaNFT = asyncHandler(async (req, res) => {
    const NFT = await NFTModel.findOne({
        $and: [
            { contract_addr: req.params.contract_addr },
            { nft_id: req.params.nft_id },
        ],
    });

    if (!NFT) {
        res.status(404);
        throw new Error("NFT not found");
    }

    const { address } = req.body;
    if (!address) {
        res.status(400);
        throw new Error("address is mandatory !");
    }

    const updatedNFT = await NFTModel.findOneAndUpdate(
        {
            $and: [
                { contract_addr: req.params.contract_addr },
                { nft_id: req.params.nft_id },
            ],
        },
        { address: address },
        { new: true }
    );

    res.status(200).json(updatedNFT);
});

//@desc Transfer NFT
//@route PUT /api/nft/transfer/:contract_addr/:nft_id
//@access private
const transferNFT = asyncHandler(async (req, res) => {
    const NFT = await NFTModel.findOne({
        $and: [
            { contract_addr: req.params.contract_addr },
            { nft_id: req.params.nft_id },
        ],
    });

    if (!NFT) {
        res.status(404);
        throw new Error("NFT not found");
    }

    const { from, to } = req.body;
    if (!from || !to) {
        res.status(400);
        throw new Error("addresses (from, to) are mandatory !");
    }

    const EOAfrom = await EOAModel.findOne({ address: from });
    const NFTfrom = await NFTModel.findOne({ address: from });

    const EOAto = await EOAModel.findOne({ address: to });
    const NFTto = await NFTModel.findOne({ address: to });

    // check if address:to is valid and address:from is valid or "0"
    if ((!EOAfrom && !NFTfrom && from !== "0") || (!EOAto && !NFTto)) {
        res.status(404);
        throw new Error("From or To address not valid");
    }
    const fromParentEOA = await getEOAFrom(from);
    const toParentEOA = await getEOAFrom(to);
    const nftParentEOA = await getEOAFrom(NFT.address);

    if (
        (nftParentEOA !== "NULL" || fromParentEOA !== "0") &&
        nftParentEOA !== fromParentEOA
    ) {
        res.status(404);
        throw new Error("From address is not the owner of the NFT");
    }

    const fromParentList = await getParentList(NFT.parent_address);
    const toParentList = await getParentList(to);

    if (fromParentEOA == "NULL" || toParentEOA == "NULL") {
        res.status(404);
        throw new Error("From(nft|eoa) or To(nft|eoa) owner address not found");
    }

    console.log("fromParentEOA: ", fromParentEOA);
    console.log("toParentEOA: ", toParentEOA);
    console.log("fromParentList: ", fromParentList);
    console.log("toParentList: ", toParentList);
    console.log("nftParentEOA: ", nftParentEOA);

    // update Accounts

    var subTree = {};

    for (let i = 0; i < fromParentList.length; i++) {
        const {
            removeStatus,
            updatedFromURL,
            removedSubTree,
            updatedFromState,
        } = await removeFromAccount(
            fromParentList[i],
            NFT.contract_addr,
            NFT.nft_id,
            NFT.state_url
        );

        if (!removeStatus) {
            res.status(404);
            throw new Error("problem during removing the NFT");
        }

        subTree = removedSubTree;

        if (fromParentEOA !== "0") {
            if (i == fromParentList.length - 1) {
                // last element in the parent list: the root: EOA address
                const updatedFromEOA = await EOAModel.findOneAndUpdate(
                    {
                        address: fromParentEOA,
                    },
                    {
                        state_url: updatedFromURL,
                        state: updatedFromState,
                    },
                    { new: true }
                );
            } else {
                const updatedFromNFT = await NFTModel.findOneAndUpdate(
                    {
                        address: fromParentList[i],
                    },
                    {
                        state_url: updatedFromURL,
                        state: updatedFromState,
                    },
                    { new: true }
                );
            }
        }

        console.log("Successfully removed from: ", fromParentList[i]);
    }

    console.log("subtree: ", subTree);
    console.log("_________________________________________________________");

    for (let i = 0; i < toParentList.length; i++) {
        const { addStatus, updatedToURL, updatedToState } = await addToEOA(
            toParentList[i],
            to,
            subTree
        );

        if (!addStatus) {
            res.status(404);
            throw new Error("problem during appending the NFT"); // it should not happen!
        }

        if (i == toParentList.length - 1) {
            // last element in the parent list: the root: EOA address
            const updatedToEOA = await EOAModel.findOneAndUpdate(
                {
                    address: toParentList[i],
                },
                {
                    state_url: updatedToURL,
                    state: updatedToState,
                },
                { new: true }
            );
        } else {
            const updatedToNFT = await NFTModel.findOneAndUpdate(
                {
                    address: toParentList[i],
                },
                {
                    state_url: updatedToURL,
                    state: updatedToState,
                },
                { new: true }
            );
        }

        console.log("Successfully added to: ", toParentList[i]);
    }

    const updatedNFT = await NFTModel.findOneAndUpdate(
        {
            $and: [
                { contract_addr: req.params.contract_addr },
                { nft_id: req.params.nft_id },
            ],
        },
        { parent_address: to },
        { new: true }
    );

    res.status(200).json({
        fromParents: fromParentList,
        toParents: toParentList,
    });
});

//@desc Update NFT
//@route PUT /api/tba/address/:contract_addr/:nft_id
//@access private
const updateNFT = asyncHandler(async (req, res) => {
    const NFT = await NFTModel.findOne({
        $and: [
            { contract_addr: req.params.contract_addr },
            { nft_id: req.params.nft_id },
        ],
    });

    if (!NFT) {
        res.status(404);
        throw new Error("NFT not found");
    }

    const updatedNFT = await NFTModel.findOneAndUpdate(
        {
            $and: [
                { contract_addr: req.params.contract_addr },
                { nft_id: req.params.nft_id },
            ],
        },
        req.body,
        { new: true }
    );

    res.status(200).json(updatedNFT);
});

//@desc Delete TBAs
//@route DELETE /api/tba/remove
//@access private
const removeTBAs = asyncHandler(async (req, res) => {
    const updateResult = await NFTModel.updateMany(
        {},
        { $set: { address: "NULL" } }
    );

    if (updateResult.modifiedCount > 0) {
        res.status(200).json({
            response: "Updated all NFTs' addresses to 'NULL' strings",
        });
    } else {
        res.status(404).json({ response: "No matching records found" });
    }
});

//@desc Delete contact
//@route DELETE /api/nft/d/delete-all
//@access private
const deleteNFTs = asyncHandler(async (req, res) => {
    await NFTModel.deleteMany();
    res.status(200).json({ response: "all NFTs are deleted" });
});

module.exports = {
    getNFTs,
    createNFT,
    getNFT,
    getNFTInfo,
    tbaNFT,
    transferNFT,
    updateNFT,
    removeTBAs,
    deleteNFTs,
};
