const Customer=require("../models/Customer")
const Centers=require("../models/Centers")
const Loan=require("../models/Loan")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const Sequelize=require('sequelize')

process.env.SECRET_KEY='secret'


//register
exports.cus_register=(req,res)=>{
    //  console.log('hii')
     var today=new Date();
     var birthday=new Date(req.body.birthdate);
    //  console.log(birthday)
    //  console.log(today)
    var diff = Math.floor(today.getTime() - birthday.getTime());
    var day = 1000 * 60 * 60 * 24;
    var years = Math.floor(Math.floor( Math.floor(diff/day)/31)/12);

    var message =(years+1)+" years"

    console.log(message)
     const cusData={
        customer_name:req.body.customer_name,
        nic_no:req.body.nic_no,
        address:req.body.address,
        birthdate:req.body.birthdate,
        age:message,
        gender:req.body.gender,
        tp_no:req.body.tp_no,
        occupation:req.body.occupation,
        center_no:req.body.center_no,
        guardian_name:req.body.guardian_name,
        guardian_address:req.body.guardian_address,
        guardian_nic:req.body.guardian_nic,
        guardian_tp:req.body.guardian_tp
         
     }
     Customer.findOne({
        where:{
           nic_no:req.body.nic_no
        }
    })
     .then(cus=>{
        if(!cus){
        Customer.create(cusData)
         .then(customer=>{
          res.json(customer)
          })
          .catch(err =>{
           res.send('error:'+err)
           })
        } else{
            console.log('already exist')
           res.json(404)
        }
    })
    .catch(err=>{
        res.send('error : '+err)
})
  
 ///////////////////////////////////////////////////////////////////////////
     
 }


 exports.cusCount=(req,res)=>{
    Customer.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('customer_id')), 'cus_count']]
      }).then(count=>{
            res.json(count)
      }).catch(err=>{
    res.send(err)
      })
      
}



 //get all
 exports.get_customers = (req,res)=>{

    console.log('get customer working')
    Customer.findAll({
    })
    .then(AllCus=>{
        res.json(AllCus)
    })
}

//getCenters
exports.get_centers = (req,res)=>{

    console.log('get center working')
   Centers.findAll({
    attributes: ['center_no','center_name']
    })
    .then(AllCus=>{
        res.json(AllCus)
    })
}


//edit customer
exports.edit_cus=(req,res)=>{

    var today=new Date();
    var birthday=new Date(req.body.birthdate);
   //  console.log(birthday)
   //  console.log(today)
  
   var diff = Math.floor(today.getTime() - birthday.getTime());
   var day = 1000 * 60 * 60 * 24;
   var years = Math.floor(Math.floor( Math.floor(diff/day)/31)/12);

   var message =(years+1) +" years"
   Customer.findOne({
       where:{
           customer_id:req.body.customer_id
       },
       attributes:['center_no','group_no']
       }).then(center=>{
           if(center.dataValues.center_no!=req.body.center_no){
               Loan.findOne({
                   where:{
                     customer_id:req.body.customer_id
                   }
               }).then(loan=>{
                   if(((loan=='')||(loan==null))&&(center.dataValues.group_no!=null)){
                          res.json(401)//group exists
                   }
                   else if (((loan!='')||(loan!=null))&&(center.dataValues.group_no!=null)){
                    res.json(400)  //cannot change, loan exists
                  }
                  else{
                    Customer.update({
                        address:req.body.address,
                        tp_no:req.body.tp_no,
                        occupation:req.body.occupation,
                        age:message,
                        center_no:req.body.center_no,
                        guardian_name:req.body.guardian_name,
                        guardian_address:req.body.guardian_address,
                        guardian_nic:req.body.guardian_nic,
                        guardian_tp:req.body.guardian_tp
                    },{
                        where:{
                            customer_id:req.body.customer_id
                        }
                    }).then(customer=>{
                        console.log(customer)
                        res.json(customer)
                    }).catch(err =>{
                        res.send('error:'+err)
                    })
                  }
                 
               })
           }
           else{
            Customer.update({
                address:req.body.address,
                tp_no:req.body.tp_no,
                occupation:req.body.occupation,
                age:message,
                guardian_name:req.body.guardian_name,
                guardian_address:req.body.guardian_address,
                guardian_nic:req.body.guardian_nic,
                guardian_tp:req.body.guardian_tp
            },{
                where:{
                    customer_id:req.body.customer_id
                }
            }).then(customer=>{
                     res.json(customer)
            }).catch(err =>{
                res.send('error:'+err)
            })
           }
       })

   


}

//find customer

exports.viewprofile=(req,res)=>{
    Customer.findOne({
        where:{
            customer_id:req.body.customer_id
        }
    })
    .then(customer=>{
        let token = jwt.sign(customer.dataValues,process.env.SECRET_KEY,{
            expiresIn:1440
        })
        res.json({token:token})
    })
    .catch(err =>{
        res.send('error:'+err)
    })
}
//////////////////////sanduni
exports.get_center=(req,res)=>{

    Centers.hasMany(Customer,{foreignKey:'center_no'})
    Customer.belongsTo(Centers,{foreignKey:'center_no'})
    /*Customer.hasOne(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})*/

     Customer.findAll({
         
         include:[{
               model:Centers,
                attributes:['center_no','center_name'],
            }]   

    }).then(result=>{
        res.json(result)
    })
}
 

 /// Mobile
 exports.getMemberByNIC =(req,res)=>{
    Customer.findOne({
        where:{
            nic_no : req.body.id

        }
    }).then(customers => {
        res.json(customers)
    })
}

   /// Mobile
   exports.getMemberByMEMID =(req,res)=>{
    Customer.findOne({
        where:{
            customer_id : req.body.id

        }
    }).then(customers => {
        res.json(customers)
    })
}



      /// Mobile
      exports.getMembersByGroupIDandCenterID=(req,res)=>{
        Customer.findAll({
            where:{
                center_no : req.body.centerID,
                group_no : req.body.groupID

            }
        }).then(customers => {
            res.json(customers)
        })
    }