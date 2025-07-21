const myDB = require("./database");
const express = require('express');
const app = express();
const tokenAuth = require('./Middlewares/tokenAuth');
const Tenant = require("./Models/tenants");
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

//ROUTERS
const employeeRouter = require('./routes/employees')
const tenantRouter = require('./routes/loginRegister');

app.use(express.json());
app.use(cookieParser())

app.get('/api/saas',tokenAuth, async(req, res)=>{
    const {tenantID} = req.tenant
    try{
        const tenant = await Tenant.findOne({tenantID});
        if(!tenant) return res.status(400).json({success:false, message:"Login/Register to continue"})

        res.status(200).json({success:true, message:"Your details.", tenant})
    } catch(err){
        res.status(500).json({success:false, message:"Something Went Wrong !"})
    }
});

app.use('/api/saas/tenant',tenantRouter)
app.use('/api/saas/employee', employeeRouter);

app.listen(process.env.PORT, ()=>{
    myDB();
    console.log("Server Started...");
})