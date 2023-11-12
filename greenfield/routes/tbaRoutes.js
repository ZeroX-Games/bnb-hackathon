const express = require("express");
const router = express.Router();
const {
    getNFTs,
    getNFT,
    tbaNFT,
    removeTBAs,
} = require("../controllers/nftController");
// const validateToken = require("../middleware/validateTokenHandler");

/**
 * @swagger
 * /api/tba:
 *  get:
 *      description: Get all NFTs
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/").get(getNFTs);

/**
 * @swagger
 * /api/tba/{address}:
 *  get:
 *      description: Get NFT
 *      parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: tba address
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/:address").get(getNFT);

/**
 * @swagger
 * /api/tba/{contract_addr}/{nft_id}:
 *  put:
 *      description: Associate NFT with TBA address
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
 *             address:
 *               type: string
 *         required: true
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/:contract_addr/:nft_id").put(tbaNFT);


/**
 * @swagger
 * /api/nft/remove:
 *  delete:
 *      description: remove TBA address from all NFTs
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/remove").delete(removeTBAs);

module.exports = router;
