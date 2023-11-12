const axios = require("axios");
const fs = require("fs");
const { createAndUploadObject } = require("./storageUtils");
const NFTModel = require("../../models/nftModel");
const EOAModel = require("../../models/eoaModel");
const dotenv = require("dotenv").config();

// Note: By default we assume every NFT has a parent EOA at the root of the tree structure. (except for the first call)
async function getEOAFrom(address) {
    if (address === "0") return "0";
    if (address === "NULL") return "NULL";

    const EOAfrom = await EOAModel.findOne({ address: address });
    const NFTfrom = await NFTModel.findOne({ address: address });

    if (EOAfrom) return EOAfrom.address;
    else if (NFTfrom) return getEOAFrom(NFTfrom.parent_address);
    else return "NULL";
}

// Note: By default we assume every NFT has a parent EOA at the root of the tree structure. (except for the first call)
async function getParentList(address) {
    if (address === "0" || address === "NULL") return ["0"];

    parentList = [];

    var EOAfrom = await EOAModel.findOne({ address: address });
    while (!EOAfrom) {
        let NFTfrom = await NFTModel.findOne({ address: address });
        if (!NFTfrom) return ["NULL"];

        parentList.push(NFTfrom.address);
        address = NFTfrom.parent_address;
        EOAfrom = await EOAModel.findOne({ address: address });
    }
    parentList.push(EOAfrom.address);
    return parentList;
}

function findNFTAndRemove(jsonData, nftContractAddress, nftId) {
    //DFS
    if (!jsonData || !jsonData.nfts || !Array.isArray(jsonData.nfts)) {
        return null; // Base case: No `nfts` or not an array
    }

    for (let i = 0; i < jsonData.nfts.length; i++) {
        const nft = jsonData.nfts[i];
        if (nft.contract_addr === nftContractAddress && nft.nft_id === nftId) {
            // Found the matching NFT with the specified address
            jsonData.nfts.splice(i, 1); // Remove the NFT from the nfts array
            return nft; // Return the removed NFT
        } else {
            // Continue searching in the nested nfts
            const removedSubtree = findNFTAndRemove(
                nft,
                nftContractAddress,
                nftId
            );
            if (removedSubtree) {
                return removedSubtree; // If a subtree was removed, return it
            }
        }
    }

    return null; // NFT not found in the tree
}

async function removeFromAccount(
    parentAddress,
    nftContractAddress,
    nftId,
    nftStateURL
) {
    const errorResponse = {
        removeStatus: false,
        updatedFromURL: "",
        removedSubTree: {},
        updatedFromState: {},
    };

    if (parentAddress === "0")
        return {
            removeStatus: true,
            updatedFromURL: "",
            removedSubTree: {
                contract_addr: nftContractAddress,
                nft_id: nftId,
                nfts: [], // by default, if the sender=="0" means it's just minted (with no child nfts) and needs to be assined to an EOA
            },
            updatedFromState: {},
        };

    const parentAccount =
        (await EOAModel.findOne({ address: parentAddress })) ??
        (await NFTModel.findOne({ address: parentAddress }));

    if (!parentAccount) {
        return errorResponse;
    }

    try {
        const ParentJsonData = parentAccount.state; // Store the JSON data in a variable

        const removedSubTree = findNFTAndRemove(
            ParentJsonData,
            nftContractAddress,
            nftId
        );

        var fileName;
        const eoaAccount = await EOAModel.findOne({ address: parentAddress });
        if (eoaAccount) {
            fileName = parentAccount.address + ".json";
        } else {
            fileName =
                parentAccount.contract_addr +
                "-" +
                parentAccount.nft_id +
                ".json";
        }
        const responseUrl = await createAndUploadObject(
            fileName,
            ParentJsonData
        );

        return {
            removeStatus: true,
            updatedFromURL: responseUrl,
            removedSubTree: removedSubTree,
            updatedFromState: ParentJsonData,
        };
        // return errorResponse;
    } catch (error) {
        console.log("Error while removing the subtree:", error);
        return errorResponse;
    }
}

function findNFTAndAppend(
    jsonData,
    parentNFTContractAddr,
    parentNFTId,
    newNFTOjbect
) {
    //DFS
    if (!jsonData || !jsonData.nfts || !Array.isArray(jsonData.nfts)) {
        return; // Base case: No `nfts` or not an array
    }

    for (const nft of jsonData.nfts) {
        if (
            nft.contract_addr === parentNFTContractAddr &&
            nft.nft_id === parentNFTId
        ) {
            // Found the matching NFT with the specified address
            if (!nft.nfts) {
                nft.nfts = []; // Initialize the nfts array if it doesn't exist
            }
            nft.nfts.push(newNFTOjbect); // Append the newNFT
            return;
        } else {
            // Continue searching in the nested nfts
            findNFTAndAppend(
                nft,
                parentNFTContractAddr,
                parentNFTId,
                newNFTOjbect
            );
        }
    }
}

async function addToEOA(parentAddress, toAddress, subTree) {
    const errorResponse = {
        addStatus: true,
        updatedToURL: "",
        updatedToState: {},
    };

    const parentAccount =
        (await EOAModel.findOne({ address: parentAddress })) ??
        (await NFTModel.findOne({ address: parentAddress }));

    if (!parentAccount) {
        return errorResponse;
    }

    try {
        const ParentJsonData = parentAccount.state;

        if (parentAddress === toAddress) {
            // toAddress is itself an EOA
            ParentJsonData.nfts.push(subTree);
        } else {
            const parentNFT = await NFTModel.findOne({ address: toAddress });
            if (!parentNFT) {
                return errorResponse;
            }

            findNFTAndAppend(
                ParentJsonData,
                parentNFT.contract_addr,
                parentNFT.nft_id,
                subTree
            );
        }

        var fileName;
        const eoaAccount = await EOAModel.findOne({ address: parentAddress });
        if (eoaAccount) {
            fileName = parentAccount.address + ".json";
        } else {
            fileName =
                parentAccount.contract_addr +
                "-" +
                parentAccount.nft_id +
                ".json";
        }
        const responseUrl = await createAndUploadObject(
            fileName,
            ParentJsonData
        );

        return {
            addStatus: true,
            updatedToURL: responseUrl,
            updatedToState: ParentJsonData,
        };
    } catch (error) {
        console.log("Error while adding the subtree:", error);
        return errorResponse;
    }
}

async function fetchInfo(url) {
    try {
        const response = await axios.get(url);

        const jsonData = response.data;

        console.log(jsonData);

        return jsonData;
    } catch (error) {
        console.error("Error fetching JSON:", error.message);
    }
}

// const moveKeyToEnd = (obj, keyToMove) => {
//     const { [keyToMove]: value, ...rest } = obj;
//     console.log("rest:", rest);
//     console.log("all: ", { ...rest, [keyToMove]: value });
//     return { ...rest, [keyToMove]: value };
// };

async function augmentStateWithMetadata(entityState) {
    if (!entityState) {
        return;
    }

    const nftAccount = await NFTModel.findOne({
        contract_addr: entityState.contract_addr,
        nft_id: entityState.nft_id,
    });
    if (nftAccount) {
        // add (metadata, etc) only for NFTs (not EOAs)
        entityState.metadata_url = nftAccount.metadata_url;
        entityState.state_url = nftAccount.state_url;
        // also add the metadata itself too
        entityState.address = nftAccount.address;
        entityState.parent_address = nftAccount.parent_address;
        entityState.metadata = await fetchInfo(nftAccount.metadata_url);
    } else {
        console.log("entity:", entityState);
        const eoaAccount = await EOAModel.findOne({
            address: entityState.address,
        });
        console.log("eoa:", eoaAccount);
        entityState.state_url = eoaAccount.state_url;
    }

    if (!entityState.nfts || !Array.isArray(entityState.nfts)) {
        return; // No `nfts` or not an array
    }

    for (const childNft of entityState.nfts) {
        await augmentStateWithMetadata(childNft);
    }

    // return entityState;
}

module.exports = {
    getEOAFrom,
    getParentList,
    removeFromAccount,
    addToEOA,
    augmentStateWithMetadata,
};
