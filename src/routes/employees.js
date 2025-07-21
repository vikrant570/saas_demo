const express = require('express');
const router = express.Router();
const tokenAuth = require('../Middlewares/tokenAuth');
const Employee = require('../Models/employee');

//Get Your all employees
router.get('/', tokenAuth, async (req, res)=>{
    const {tenantID} = req.tenant;

    try {
        const employees = await Employee.find({employerTenantID : tenantID},{name:1, email:1, city:1}).lean();
        if(!employees) return res.status(200).json({message: "You don't have any employess registered currently !"})
        res.status(200).json({success : true, employees})
    } catch (err){
        res.status(500).json({success :false, message : "Something Went Wrong !"});
    }
})

//Create New Employee
router.post('/', tokenAuth, async (req,res)=>{
    const {name, age, salary, city, email} = req.body;
    const {tenantID} = req.tenant

    try{
        const alreadyExists = await Employee.find({tenantID, email});
        if(!alreadyExists) return res.status(400).json({success:false, message : "Employee already exists !"});

        const newEmployee = await Employee.create({
            name, age, email, salary, city,
            employerTenantID : tenantID,
        })

        res.status(201).json({success:true, message:"Employee Created successfully.", newEmployee});
    } catch(err){
        return res.status(500).json({success:false, message:"Something went wrong"});
    }
})

//Get a specific Employee
router.get('/:id',tokenAuth, async (req,res)=>{
    try{
        const employee = await Employee.findById(req.params.id);
        if(employee.employerTenantID !== req.tenant.tenantID){
            return res.status(404).json({success : false, message : "No results found !"})
        }
        if(!employee) return res.status(200).json({message: "You don't have any employess registered currently !"})
        res.status(200).json({success:false, employee});
    } catch(err){
        res.status(500).json({success:false, message:"Something Went Wrong !"})
    }
})

//Delete an Employee
router.delete('/:id', tokenAuth, async (req, res)=>{
    try{
        const employee = await Employee.findById(req.params.id);
        if(employee.employerTenantID !== req.tenant.tenantID){
            return res.status(404).json({success : false, message : "Nothing to delete !"})
        } 

        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({success:true, message:"Employee deleted successfully."})
    } catch (err){
        res.status(500).json({success:false, message:"Something Went Wrong !"})
    }
})

module.exports = router