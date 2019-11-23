const express=require("express")
const employees=express.Router()
const cors=require("cors")
var multer  = require('multer');
employees.use(cors())



const employee_cont=require("../controllers/Employees")

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
  });
  
  var upload = multer({
    storage: storage,
    limits: { fileSize: '4M'}
  });
  


employees.post('/login',employee_cont.login)
employees.post('/emp_register',employee_cont.emp_register)
employees.get('/get_emp',employee_cont.get_employee)
employees.post('/bike_no',employee_cont.bikeNo)
employees.post('/deleteEmp',employee_cont.deleteEmp)
employees.post('/updateEmp',employee_cont.updateEmp)
employees.post('/updateBike',employee_cont.updateBikeNo)
employees.post('/loadEx',employee_cont.loadSelectedEx)
employees.post('/proImage',upload.single('profileImage'),employee_cont.profile_image)
employees.post('/pwd_hint',employee_cont.pwdHint)
employees.post('/updateUser',employee_cont.updateUser)
employees.post('/updateProf',upload.single('profileImage'),employee_cont.updateImage)
employees.post('/updateUserImage',upload.single('profileImage'),employee_cont.updateUserImage)
employees.get('/empCount',employee_cont.empCount)


employees.get('/executives',employee_cont.allExec)
employees.post('/loginForMobile',employee_cont.loginForAll)

module.exports = employees