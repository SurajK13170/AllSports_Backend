const express = require("express");
const userRoute = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {User} = require("../models/User.model")
require("dotenv").config()


/**
 * 
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the User
 *              name:
 *                  type: string
 *                  description: The name of the User
 *              email:
 *                  type: string
 *                  description: The email of the User
 *              password:
 *                  type: string
 *                  description: The password of the User
 *              role:
 *                  type: string
 *                  description: The role of the User
 */

/**
 * 
 * @swagger
 * tags:
 *  name: User
 *  description: The User managing APIs
*/

/**
 * 
 * @swagger
 * /user/register:
 *  post:
 *      summary: Register a new user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          500:
 *              description: Some server error
 *          400:
 *              description: User already exists with this Email
*/


userRoute.post('/register', async(req, res)=>{
    const {name, email, password, role} = req.body
    const existingUser = await User.findOne({where: {email}})
    if(existingUser){
        return res.status(400).json({message: "User already exists"})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    try{
        const user = await User.create({name, email, password: hashPassword, role})
        res.status(201).json({user})
    }catch(err){
        res.status(500).json({err})
    }
})

/**
 * @swagger
 * /user/login:
 *  post:
 *    summary: Login a user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: user@example.com
 *              password:
 *                type: string
 *                format: password
 *                example: password123
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      401:
 *        description: Invalid credentials
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         role:
 *           type: string
 *           example: user
 */

userRoute.post('/login', async(req, res)=>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({where: {email}})
        console.log(user)
        if(user){
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if(isPasswordValid){
                const token = jwt.sign({id: user.id, role:user.role}, process.env.SECRET_KEY,{expiresIn: "1h"})
                res.status(200).json({user, token})
            }else{  
                res.status(401).json({message: "Invalid credentials"})
            }
        }else{
            res.status(401).json({message: "Invalid credentials"})
        }
    }catch(err){
        res.status(500).json({err})
    }
})

module.exports = {userRoute}