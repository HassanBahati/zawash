//imports
const express = require('express');
const multer = require('multer');
const Employee = require('../models/Admin')
//instantiating router from express
const router = express.Router();

///get employee
router.get('/createEmployee', (req, res) => { 
    res.render('createEmployee', {title: 'Employee'});
});

//list 
router.get('/', async (req, res) => { 
    try{
        //find all data in database 
        const employeeDetails = await Employee.find();
        res.render('employeeList', {users:employeeDetails, title: 'EmployeeList'});
       
    }catch(err){
        res.send('Failed to retireve Employee Details ')
    }
});



//image upload 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage})

// router.post('/createEmployee', upload.single('imageupload'), (req,res) => {
//     try {
//         console.log(req.file)
//     }
//     catch(err) {
//         res.send(400);
//     }
// })

router.post('/createEmployee', upload.single('imageupload'), async (req, res) => {
    try{
        console.log(req.body);
        const employee = new Employee(req.body);
      
    employee.imageupload = req.file.path;
        //await code performing db operation 
        await employee.save()
        
        res.redirect('/employee')
    } catch(err){

        console.log(err);
        res.send('Sorry! Something went wrong.');
    }
    
});

// update record based on the _id from the database
// after adding the update button on the  employeelist
// renders the updateEmployee pug file where you can update
// add the `app.use('/public/images', express.static(__dirname + '/public/images'));`
// to index.js to make sure image is showing
router.get('/update/:id', async (req, res) => {
    try {
        const updateEmp = await Employee.findOne({ _id: req.params.id })
        res.render('updateEmployee', { user: updateEmp })
    } catch (err) {
        res.status(400).send("Unable to find item in the database");
    }
})

// route to save the updated data
router.post('/update', async (req, res) => {
    try {
        await Employee.findOneAndUpdate({_id:req.query.id}, req.body)
        res.redirect('/employee');
    } catch (err) {
        console.log(err)
        res.status(404).send("Unable to update item in the database");
    }
})

//delete and employee record from the database
// add the delete code to the employeelist pug file
router.post('/delete', async (req, res) => {
    try {
        await Employee.deleteOne({ _id: req.body.id })
        res.redirect('back')
    } catch (err) {
        res.status(400).send("Unable to delete item in the database");
    }
});


//search employee
router.get('/employeeList', async(req, res) =>{
  
    try {
 //find all the data in the employee collection 
 let employeeDetails = await Employee.find();
     if(req.query.gender){
       employeeDetails = await Employee.find({gender: req.query.gender});
     }
     res.render('employeeList', {users: employeeDetails, title:'Employee List'})
    } catch (err) {
      res.status(400).send('Failed to retrieve Employee Details');
    }
 
})



//exports
module.exports = router;


// const employee = new Employee(req.body);
//     employee.imageupload = req.file.path;
//     employee.save()
//         .then(() => { res.redirect('/employee') })
//         .catch((err) => {
//             console.log(err);
//             res.send('Sorry! Something went wrong.');
//         })
