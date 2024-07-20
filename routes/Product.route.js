const express = require("express")
const {Product} = require("../models/Product.model")
const {Category} = require("../models/Category.model")
const productRoute = express.Router()
const {authenticateToken} = require("../middelware/auth")
const {authorizeRoles} = require("../middelware/authorization")


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         categoryId:
 *           type: integer
 *           description: The ID of the category the product belongs to
 *       required:
 *         - name
 *         - price
 *         - categoryId
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: The Product managing APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */


productRoute.get("/",authenticateToken, async(req, res)=>{
   try{
    const products = await Product.findAll({
        include:{
            model:Category,
            as:"Category"

        }
    })
    res.status(200).json({products})
   }catch(err){
    res.status(500).json({err}) 
   }
})

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */




productRoute.get('/:id',authenticateToken, async(req, res)=>{
    const {id} = req.params;
    try{
        const product = await Product.findOne({
            where: {id},
            include:{
                model:Category,
                as:"Category"
            }
        })
        if(!product) return res.status(404).json({message: "Product not found"})
        else res.status(200).json({product})
    }catch(err){
        res.status(500).json({err})
    }
})


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */

productRoute.post('/',authenticateToken,authorizeRoles(["admin"]), async(req, res)=>{
    try{
        const {name, description, price, categoryId} = req.body
        const product = await Product.create({name, description, price, categoryId})
        res.status(201).json({product})
    }catch(err){
        res.status(500).json({err})
    }
})


/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

productRoute.patch('/:id',authenticateToken,authorizeRoles(["admin"]), async(req, res)=>{
    const {id} = req.params
    const {name, description, price, categoryId} = req.body
    try{
        const {updated} = await Product.update({name, description, price, categoryId}, {where: {id}})
        if(updated){
            const updateProd = await Product.findOne({
                where: {id},
                include:{
                    model:Category,
                    as:"Category"
                }
            })
            res.status(200).json({
                product: updateProd
            })
        }   
        else res.status(200).json({message: "Product updated successfully"})
    }catch(err){
        res.status(500).json({err})
    }
})

productRoute.delete('/:id',authenticateToken,authorizeRoles(["admin"]), async(req, res)=>{
    const {id} = req.params
    try{
        const product = await Product.destroy({where: {id}})
        if(!product) return res.status(404).json({message: "Product not found"})
        else res.status(200).json({message: "Product deleted successfully"})
    }catch(err){
        res.status(500).json({err})
    }
})

module.exports = {productRoute}