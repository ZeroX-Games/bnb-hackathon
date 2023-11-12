const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "NFT API",
            description: "NFT API Information",
            contact: {
                name: "Taha Shabani",
            },
            servers: ["http://localhost:5001"],
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const port = process.env.PORT || 5001;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/eoa", require("./routes/eoaRoutes"));
app.use("/api/nft", require("./routes/nftRoutes"));
app.use("/api/tba", require("./routes/tbaRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
