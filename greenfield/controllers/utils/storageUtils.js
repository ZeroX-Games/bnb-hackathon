const dotenv = require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mimeTypes = require("mime-types");
const { getCheckSums } = require("@bnb-chain/greenfiled-file-handle");
const { client, selectSp, generateString } = require("./client");
const { File, Buffer } = require("buffer");

async function uploadJson(context, apikey, name) {
    const response = await lighthouse.uploadText(context, apikey, name);

    return response; // use response.data.Hash for state URL
}

async function createObject(objectName, jsonData) {
    try {
        const fileBuffer = Buffer.from(
            JSON.stringify(jsonData, null, 2),
            "utf-8"
        );
        const fileArray = new Uint8Array(fileBuffer);
        const hashResult = await getCheckSums(fileArray);

        const { contentLength, expectCheckSums } = hashResult;

        const createObjectTx = await client.object.createObject(
            {
                bucketName: process.env.GREENFIELD_NFT_STATE_BUCKET,
                objectName: objectName,
                creator: process.env.ACCOUNT_ADDRESS,
                visibility: "VISIBILITY_TYPE_PUBLIC_READ",
                fileType: "application/json",
                redundancyType: "REDUNDANCY_EC_TYPE",
                contentLength,
                expectCheckSums: JSON.parse(expectCheckSums),
            },
            {
                type: "ECDSA",
                privateKey: process.env.ACCOUNT_PRIVATEKEY,
            }
        );

        const createObjectTxSimulateInfo = await createObjectTx.simulate({
            denom: "BNB",
        });

        const createObjectTxRes = await createObjectTx.broadcast({
            denom: "BNB",
            gasLimit: Number(createObjectTxSimulateInfo?.gasLimit),
            gasPrice: createObjectTxSimulateInfo?.gasPrice || "5000000000",
            payer: process.env.ACCOUNT_ADDRESS,
            granter: "",
            privateKey: process.env.ACCOUNT_PRIVATEKEY,
        });

        console.log("create object success", createObjectTxRes);

        return createObjectTxRes.transactionHash;
    } catch (error) {
        console.log("error", error);
    }
}

async function uploadObject(objectName, jsonData, txHash) {
    try {
        const fileBuffer = Buffer.from(
            JSON.stringify(jsonData, null, 2),
            "utf-8"
        );

        const customFile = new File([fileBuffer], objectName, {
            type: "application/json",
        });

        const uploadRes = await client.object.uploadObject(
            {
                bucketName: process.env.GREENFIELD_NFT_STATE_BUCKET,
                objectName: objectName,
                body: customFile,
                txnHash: txHash,
            },
            {
                type: "ECDSA",
                privateKey: process.env.ACCOUNT_PRIVATEKEY,
            }
        );
        console.log("uploadRes", uploadRes);
        return (
            process.env.GREENFIELD_GATEWAY +
            process.env.GREENFIELD_NFT_STATE_BUCKET +
            "/" +
            objectName
        );
    } catch (error) {
        console.log("error", error);
        return "";
    }
}

async function deleteObject(objectName) {
    try {
        const deleteObjectTx = await client.object.deleteObject({
            bucketName: process.env.GREENFIELD_NFT_STATE_BUCKET,
            objectName: objectName,
            operator: process.env.ACCOUNT_ADDRESS,
        });

        const simulateInfo = await deleteObjectTx.simulate({
            denom: "BNB",
        });

        const res = await deleteObjectTx.broadcast({
            denom: "BNB",
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || "5000000000",
            payer: process.env.ACCOUNT_ADDRESS,
            granter: "",
            privateKey: process.env.ACCOUNT_PRIVATEKEY,
        });
        console.log("delete res", res);
    } catch (error) {
        console.log("delete error:", error);
    }
}

async function createAndUploadObject(objectName, jsonData) {
    console.log("************************* delete *************************");
    await deleteObject(objectName);
    console.log("************************* create *************************");
    const txHash = await createObject(objectName, jsonData);
    console.log("************************* update *************************");
    const responseUrl = await uploadObject(objectName, jsonData, txHash);
    return responseUrl;
}

async function createEOAURL(address) {
    const eoaTemplate = {
        address: address,
        nfts: [],
    };

    fileName = address + ".json";
    const stateUrl = await createAndUploadObject(fileName, eoaTemplate);

    return {
        jsonObject: eoaTemplate,
        stateUrl: stateUrl,
    };
}

async function createNFTURL(contract_addr, nft_id) {
    const nftTemplate = {
        contract_addr: contract_addr,
        nft_id: nft_id,
        nfts: [],
    };

    fileName = contract_addr + "-" + nft_id + ".json";
    const stateUrl = await createAndUploadObject(fileName, nftTemplate);

    return {
        jsonObject: nftTemplate,
        stateUrl: stateUrl,
    };
}

module.exports = {
    uploadJson,
    createEOAURL,
    createNFTURL,
    createObject,
    uploadObject,
    deleteObject,
    createAndUploadObject,
};
