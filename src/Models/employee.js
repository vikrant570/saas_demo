const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employerTenantID : {
        type: String,
        required: true,
        match: [/^[A-Za-z0-9]+$/, "Tenant ID must be alphanumeric"]
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: [0, "Salary must be a positive number"]
    },
    city: {
        type: String,
        required: true,
        match : [/^[A-Za-z\s]+$/, "City name can't have numbers or special characters !"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address" ]
    }
});

const Employee = mongoose.model('employees', employeeSchema);
module.exports = Employee;
