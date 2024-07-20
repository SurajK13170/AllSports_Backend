const express = require("express");
const { Category } = require("../models/Category.model");
const categoryRoute = express.Router();
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
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *       required:
 *         - name
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The Category managing APIs
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       404:
 *         description: No categories found
 *       500:
 *         description: Internal server error
 */
categoryRoute.get("/",authenticateToken,authorizeRoles(["admin"]), async (req, res) => {
    try {
        const categories = await Category.findAll();
        if (!categories.length) return res.status(404).json({ message: "No categories found" });
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a single category by ID
 *     tags: [Category]
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
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */


categoryRoute.get("/:id",authenticateToken,authorizeRoles(["admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ where: { id } });
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */



categoryRoute.post("/", authenticateToken,authorizeRoles(["admin"]),async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({name})
        res.status(201).json({ category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */


categoryRoute.patch("/:id", authenticateToken,authorizeRoles(["admin"]),async (req, res) => {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    try {
        const category = await Category.findOne({ where: { id } });
        if (!category) return res.status(404).json({ message: "Category not found" });
        await Category.update({ name, description, price, categoryId }, { where: { id } });
        res.status(200).json({ message: "Category updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
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
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */


categoryRoute.delete("/:id",authenticateToken,authorizeRoles(["admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const rowsDeleted = await Category.destroy({ where: { id } });
        if (!rowsDeleted) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { categoryRoute };
