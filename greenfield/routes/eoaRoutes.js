const express = require("express");
const router = express.Router();
const {
    getEOAs,
    createEOA,
    getEOA,
    deleteEOA,
    deleteEOAs,
} = require("../controllers/eoaController");
// const validateToken = require("../middleware/validateTokenHandler");

// router.use(validateToken);
/**
 * @swagger
 * /api/eoa:
 *  get:
 *      description: Get all EOAs
 *      responses:
 *          '200':
 *              description: Success
 */

/**
 * @swagger
 * /api/eoa:
 *  post:
 *      description: Create New EOA
 *      parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *         required: true
 *         description: address
 *      responses:
 *          '200':
 *              description: Success
 */

router.route("/").get(getEOAs).post(createEOA)

/**
 * @swagger
 * /api/eoa/{address}:
 *  get:
 *      description: Get EOA
 *      parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: address
 *      responses:
 *          '200':
 *              description: Success
 */

/**
 * @swagger
 * /api/eoa/{address}:
 *  delete:
 *      description: Delete EOA
 *      parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: address
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/:address").get(getEOA).delete(deleteEOA);

/**
 * @swagger
 * /api/eoa/d/delete-all:
 *  delete:
 *      description: Delete all EOAs
 *      responses:
 *          '200':
 *              description: Success
 */
router.route("/d/delete-all").delete(deleteEOAs);

module.exports = router;
