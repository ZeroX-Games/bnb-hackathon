const express = require("express");
const router = express.Router();
const {
    getNFTInfo,
    createNFT,
    transferNFT,
    updateNFT,
    deleteNFTs,
} = require("../controllers/nftController");
// const validateToken = require("../middleware/validateTokenHandler");

/**
 * @swagger
 * /api/nft/{contract_addr}/{nft_id}:
 *  get:
 *      description: Get NFT Metadata
 *      parameters:
 *       - in: path
 *         name: contract_addr
 *         schema:
 *           type: string
 *         required: true
 *         description: contract address
 *       - in: path
 *         name: nft_id
 *         schema:
 *           type: string
 *         required: true
 *         description: nft id
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/:contract_addr/:nft_id").get(getNFTInfo);

/**
 * @swagger
 * /api/nft/mint:
 *  post:
 *      description: Mint NFT
 *      parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             contract_addr:
 *               type: string
 *               required: true
 *             nft_id:
 *               type: string
 *               required: true
 *             metadata_url:
 *               type: string
 *               required: false
 *         required: true
 *         description: contract address, nft id, metadata url
 *      responses:
 *          '201':
 *              description: Success
 */
router.route("/mint").post(createNFT);

/**
 * @swagger
 * /api/nft/transfer/{contract_addr}/{nft_id}:
 *  put:
 *      description: Transfer NFT
 *      parameters:
 *       - in: path
 *         name: contract_addr
 *         schema:
 *           type: string
 *         required: true
 *         description: contract address
 *       - in: path
 *         name: nft_id
 *         schema:
 *           type: string
 *         required: true
 *         description: nft id
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *             to:
 *               type: string
 *         required: true
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/transfer/:contract_addr/:nft_id").put(transferNFT);

/**
 * @swagger
 * /api/nft/update/{contract_addr}/{nft_id}:
 *  put:
 *      description: Update NFT characteristics like metadata, etc
 *      parameters:
 *       - in: path
 *         name: contract_addr
 *         schema:
 *           type: string
 *         required: true
 *         description: contract address
 *       - in: path
 *         name: nft_id
 *         schema:
 *           type: string
 *         required: true
 *         description: nft id
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             metadata:
 *               type: object
 *               required: false
 *             metadata_url:
 *               type: string
 *               required: false
 *             data_url:
 *               type: string
 *               required: false
 *         required: true
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/update/:contract_addr/:nft_id").put(updateNFT);

/**
 * @swagger
 * /api/nft/d/delete-all:
 *  delete:
 *      description: Delete all NFTs
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/d/delete-all").delete(deleteNFTs);

module.exports = router;
