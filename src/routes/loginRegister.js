const express = require('express');
const Tenant = require('../Models/tenants');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const tokenAuth = require('../Middlewares/tokenAuth')

router.post('/register', async (req, res)=>{
    const {name, firmName, firmEmail, password} = req.body;
    
    // Check if tenant with the same firmEmail already exists
    try{
        const existingTenant = await Tenant.findOne({ firmEmail });
        if (existingTenant) {
            return res.status(400).json({ success: false, message: "Tenant with this email already exists." });
        }

        //A unique Tenant ID for every new company with a prefix 570 (for ex.)
        function generateTenantID(firmName) {
            // Remove all non-alphabetic characters and spaces
            const alphaPart = firmName.replace(/[^A-Za-z]/g, '');
            const numericPart = 570 + Math.floor(1000 + Math.random() * 9000).toString();
            return `${alphaPart}${numericPart}`;
        }
        const tenantID = generateTenantID(firmName);

        const newTenant = new Tenant({name, firmName, firmEmail, tenantID, password});
        await newTenant.save();
        res.status(201).json({sucess : true, message : `Registration sucessfull ${name} \n Your unique Tenant Id is - ${tenantID}. \n Save it for furether reference.`})
    } catch (err){
        res.status(500).json({success : false, message : "Internal Server Error."});
    }
})

router.post('/login', async (req, res)=>{
    const {firmEmail, tenantID, password} = req.body;
    const tenant = await Tenant.findOne({firmEmail:firmEmail, tenantID: tenantID})
    if(!tenant){
        return res.status(401).json({sucess : false, message : "Tenant doesn't exist !"});
    }

    const isValid = await bcrypt.compare(password, tenant.password);
    if(!isValid){
        return res.status(401).json({success : false, message : "Email or password is incorrect."})
    }

    const token = jwt.sign({tenantID}, process.env.JWT_SECRET, {expiresIn : "1h"})

    res.cookie("token", token, {
        httpOnly : true,
        maxAge : 60*60*1000
    })
    res.status(200).json({success : true, message : "Login Successfull."})
})

router.delete('/delete', tokenAuth, async (req, res)=>{
    try{
        // A user can only delete if they are logged in so no need of verification here.
        await Tenant.findOneAndDelete({tenantID: req.tenant.tenantID});
        res.json(201).json({success:true, message:"Tenant Account deleted successfully."})
    } catch (err){
        res.status(500).json({success:false, message:"Something Went Wrong !"})
    }
})

module.exports = router