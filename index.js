const express = require("express");
const { sequelize } = require("./db");
const swaggerJSdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
require("dotenv").config()
const cors = require("cors");
const { userRoute } = require("./routes/User.route");
const { productRoute } = require("./routes/Product.route");
const { categoryRoute } = require("./routes/Category.route");
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.port || 8000;


app.use('/user', userRoute)
app.use('/products', productRoute)
app.use('/categories', categoryRoute)

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentation with Swagger",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ]
    },
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJSdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

sequelize.sync().then(() => {
    console.log("Table created successfully!");
}).catch((error) => {
    console.log(error.message);
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

module.exports = { app }