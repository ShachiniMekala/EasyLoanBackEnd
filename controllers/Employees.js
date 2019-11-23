const Employee=require("../models/Employee")
const Executive=require("../models/Executive")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const Center=require("../models/Centers")
var fs = require('fs');
const Sequelize=require('sequelize')

process.env.SECRET_KEY='secret'
const ImageData = {
    employee_no: 0,
    employee_img: '',
  }
  
//register
exports.emp_register=(req,res)=>{
    // console.log('hii')
     
    if(req.body.employee_img==''){
   var img='default.png'
    }
     
     ImageData.employee_img=req.body.employee_img;
     console.log(req.body.employee_img)
     
     const empData={
         employee_name:req.body.employee_name,
         employee_img:img,
         gender:req.body.gender,
         birthdate:req.body.birthdate,
         nic_no :req.body.nic_no,
         address:req.body.address,
         tp_no:req.body.tp_no,
         email_adress:req.body.email_adress,
         employee_type:req.body.employee_type,
         epf_no:req.body.epf_no,
         etf_no:req.body.etf_no,
         e_password:req.body.e_password,
         password_hint:req.body.password_hint
         
     }
 
  
 
     Employee.findOne({
         where:{
             email_adress:req.body.email_adress
         }
     })
      .then(employee=>{
         if(!employee){
             const hash=bcrypt.hashSync(empData.e_password,10)
             empData.e_password=hash
             Employee.create(empData)
             .then(employees=>{
                ImageData.employee_no=employees.dataValues.employee_no;
                res.json(employees)
                 })
                 .catch(err=>{
                     res.json(400)
             })
         } else{
             console.log('already exist')
            res.json(404)
         }
     })
     .catch(err=>{
         res.send('error : '+err)
 })
 
 }
 

 //profile image
 exports.profile_image = (req, res, next) => {
     console.log('profile image uploading')
    if (!req.file) {
      res.status(500);
      return next(err);
    } else {
      console.log(ImageData)
  
      Employee.update({
        employee_img: req.file.filename
      },
        {
          where: {
        employee_no: ImageData.employee_no
          }
        }).then(emp=>{
            res.json(emp)
        }).catch(err=>{
            res.send(err);
        })
  
    ;
    }
  }
 //delete
 
exports.deleteEmp=(req,res)=>{
Center.findAll({
    where:{
        executive_id:req.body.employee_no
    }
}).then(emp=>{
 
if(emp==''){
    Executive.destroy({
        where:{
            employee_no:req.body.employee_no
        }
    }).then(ex=>{
        Employee.destroy({
            where:{
                employee_no:req.body.employee_no
            }
        }).then(result=>{
            res.json(result)
        }).catch(err=>{
            res.send(err)
        })
    }).catch(err=>{
        res.send(err)
    })
}
else{
    res.json(400)//cannot delete assigned executives
}
}).catch(err=>{
res.json(err)
})


}
 

//login
 exports.login=(req,res)=>{
    Employee.findOne({
        where:{
            email_adress:req.body.email_adress
        }
    })
    .then(employee=>{
        
        if(employee.employee_type!="Executive"){
            
            if(bcrypt.compareSync(req.body.e_password,employee.e_password)){
                let token=jwt.sign(employee.dataValues,process.env.SECRET_KEY,{
                      expiresIn:1440
                })
                res.json({token:token})
            }
            else{
                res.json(401)//password incorrect
            }
        }
        else{
            res.json(402)//executives cannot login
        }
      
    })
    .catch(err=>{
        res.json(403)//does not exists
       
    })
}

exports.pwdHint=(req,res)=>{
Employee.findOne({
    attributes: ['email_adress','password_hint','employee_type'],
    where:{
        email_adress:req.body.email_adress
    }
}).then(emp=>{
    console.log(emp.dataValues.employee_type)
    if(emp.dataValues.employee_type!='Executive'){
        res.json(emp)
    }
    
    else{
        res.json(400)
    }
    
}).catch(err=>{
    res.send(err)
})
}

exports.empCount=(req,res)=>{
    Employee.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('employee_no')), 'emp_count']]
      }).then(count=>{
            res.json(count)
      }).catch(err=>{
    res.send(err)
      })
      
}


//get all emloyees
 

 exports.get_employee = (req,res)=>{
    Employee.findAll({
    })
    .then(AllEmp=>{
        res.json(AllEmp)
    })
}

//bikenumber 

exports.bikeNo=(req,res)=>{
    console.log('Bike Register Working')
    
     const bikeNo={
        employee_no:req.body.employee_no,
        bike_no:req.body.bike_no,
        }
 
  
 
    Executive.create(bikeNo)
     .then(bike_no=>{
        res.json(bike_no)
    })
    .catch(err =>{
        res.send('error:'+err)
    })
}



exports.loadSelectedEx=(req,res)=>{
    console.log('selecting executive')
    Executive.findOne({
        where:{
            employee_no:req.body.employee_no
        }
    }).then(ex=>{
        res.json(ex)
     }).catch(err=>{
        res.send(err);
     })
}

exports.updateEmp=(req,res)=>{

    ImageData.employee_no=req.body.employee_no
    ImageData.employee_img=req.body.employee_img

    if(req.body.e_password!=''){
        console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
        Employee.findOne({
            where:{
             employee_no:req.body.employee_no
         }
        }).then(ex=>{
            console.log('passwordChangingggggggggg')
           if(bcrypt.compareSync(req.body.e_password,ex.e_password)){
               console.log('innnnnnnnnnnnnnn')
            const hash=bcrypt.hashSync(req.body.new_password,10)
            console.log('addressssssssss'+req.body.address)
            Employee.update({
                address:req.body.address,
                tp_no:req.body.tp_no,
                email_adress:req.body.email_adress,
                epf_no:req.body.epf_no,
                etf_no:req.body.etf_no,
                e_password:hash,
                password_hint:req.body.new_hint, 
            },{
                where:{
                    employee_no:req.body.employee_no
                }
            }).then(employee=>{
                console.log(employee)
                res.json(employee)
            }).catch(err =>{
                res.send('error:'+err)
            })
           }
    
           else{
               console.log('Your password is incorrect');
               res.json(401)
           }
        }).catch(err=>{
            res.send(err)
       })
        }

    else{
        Employee.update({
            address:req.body.address,
            tp_no:req.body.tp_no,
            email_adress:req.body.email_adress,
            employee_type:req.body.employee_type,
            epf_no:req.body.epf_no,
            etf_no:req.body.etf_no
            
        },{
            where:{
                employee_no:req.body.employee_no
            }
        }).then(employee=>{
                 res.json(employee)
        }).catch(err =>{
            res.send('error:'+err)
        })
    }
   
}

exports.updateUser=(req,res)=>{
    ImageData.employee_no=req.body.employee_no
    ImageData.employee_img=req.body.employee_img


    if(req.body.e_password!=''){
    Employee.findOne({
        where:{
          employee_no:req.body.employee_no
        }
    }).then(user=>{
    if(bcrypt.compareSync(req.body.e_password,user.e_password))
       {
        const hash=bcrypt.hashSync(req.body.new_password,10)
        Employee.update({
            address:req.body.address,
            tp_no:req.body.tp_no,
            email_adress:req.body.email_adress,
            epf_no:req.body.epf_no,
            etf_no:req.body.etf_no,
            e_password:hash,
            password_hint:req.body.new_hint, 
        },{
            where:{
                employee_no:req.body.employee_no
            }
        }).then(employee=>{
            console.log('ok')
            Employee.findOne({
                where:{
                    employee_no:req.body.employee_no
                }
            })
            .then(user=>{
                let token = jwt.sign(user.dataValues,process.env.SECRET_KEY,{
                    expiresIn:1440
                })
                res.json({token:token})
            })
            .catch(err =>{
                res.send('error:'+err)
            })
        }).catch(err =>{
            res.send('error:'+err)
        })
       }

       else{
           console.log('Your password is incorrect');
           res.json(400)//password is incorrect
       }
    }).catch(err=>{
        res.send(err)
   })
    }

    else{
        Employee.update({
            address:req.body.address,
            tp_no:req.body.tp_no,
            email_adress:req.body.email_adress,
            epf_no:req.body.epf_no,
            etf_no:req.body.etf_no
            
        },{
            where:{
                employee_no:req.body.employee_no
            }
        }).then(employee=>{
          Employee.findOne({
                where:{
                    employee_no:req.body.employee_no
                }
            })
            .then(user=>{
                let token = jwt.sign(user.dataValues,process.env.SECRET_KEY,{
                    expiresIn:1440
                })
                res.json({token:token})
            })
            .catch(err =>{
                res.send('error:'+err)
            })
        
        }).catch(err =>{
            res.send('error:'+err)
        })
 }
}

exports.updateImage=(req,res)=>{

    console.log('updating')
    if (!req.file) {
        res.status(500);
        return next(err);
      } else {
        if(ImageData.employee_img!= 'default.png'){
            var filePath = './uploads/'.concat(ImageData.employee_img) ; 
            fs.unlinkSync(filePath);
          }
      
        console.log(ImageData)
        console.log(req.file.filename)
        Employee.update({
         employee_img: req.file.filename
        },
          {
            where: {
              employee_no:ImageData.employee_no
            }
          })
          .then(emp => {
            res.json(emp)
        
          }).catch(err=>{
              res.send(err)
          })
    
      }

}

exports.updateUserImage=(req,res)=>{
    console.log('updating user')
    if (!req.file) {
        res.status(500);
        return next(err);
      } else {
        // if(ImageData.employee_img!= 'default.png'){
        //     var filePath = './uploads/'.concat(ImageData.employee_img) ; 
        //     fs.unlinkSync(filePath);
        //   }
      
        console.log(ImageData)
        console.log(req.file.filename)
        Employee.update({
         employee_img: req.file.filename
        },
          {
            where: {
              employee_no:ImageData.employee_no
            }
          })
          .then(emp => {
            Employee.findOne({
                where:{
                    employee_no:ImageData.employee_no
                }
            })
            .then(user=>{
                let token = jwt.sign(user.dataValues,process.env.SECRET_KEY,{
                    expiresIn:1440
                })
                res.json({token:token})
            })
            .catch(err =>{
                res.send('error:'+err)
            })
        
          }).catch(err=>{
              res.send(err)
          })
    
      }
}

exports.updateBikeNo=(req,res)=>{
    console.log('bike is'+req.body.bike_no)
    console.log('employee is'+req.body.employee_no)
    Executive.update({
       bike_no:req.body.bike_no
    },{
        where:{
            employee_no:req.body.employee_no
        }
    }).then(ex=>{
             res.json(ex)
    }).catch(err =>{
        res.send('error:'+err)
    })
}

exports.allExec=(req,res)=>{
    Executive.findAll({
       attributes:['employee_no'] 
    }).then(ex=>{
        res.json(ex)
    }).catch(err=>{
        res.send(err)
    })
}

 
// Mobile
exports.loginForAll=(req,res)=>{

    console.log(req.body.e_password);

    Employee.findOne({
        where:{
            email_adress:req.body.email_adress
        }
    })
    .then(employee=>{
        
    
            
            if(bcrypt.compareSync(req.body.e_password,employee.e_password)){
                let token=jwt.sign(employee.dataValues,process.env.SECRET_KEY,{
                      expiresIn:1440
                })
                res.json({token:token,id:employee.employee_no})
            }
            else{
                res.json(401)//password incorrect
            }
        
      
    })
    .catch(err=>{
        res.json(403)//does not exists
       
    })
}

