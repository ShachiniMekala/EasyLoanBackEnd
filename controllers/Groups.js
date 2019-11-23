const Group = require("../models/Group")
const Customer = require("../models/Customer")
const Loan= require("../models/Loan")
const Sequelize = require("sequelize")
const Op = Sequelize.Op;

exports.add_group = (req, res) => {
console.log("backend add group working")
    for (i = 0; i < req.body.group_no.length; i++) {

        group = {
            //center_id:req.body.center_id,
            center_no: req.body.center_no,
            group_no: req.body.group_no[i]
        }

        Group.create(group)

    }
}
exports.addExtra_group = (req, res) => {
    console.log("backend add extragroup working")
           group = {
                //center_id:req.body.center_id,
                center_no: req.body.center_no,
                group_no: req.body.group_no
            }
    
            Group.create(group).then(AllGroup=>{
                res.json(200)
            }).catch(
                err=>{
                    console.log(err)
                    res.json(404)
                }
            )
    
        
    }


    exports.changecustomergroup = (req,res)=>{
        Customer.hasMany(Loan,{foreignKey:'customer_id'})
        Loan.belongsTo(Customer,{foreignKey:'customer_id'})
        Customer.findAll({
           attributes:['customer_id','center_no'],
            include:[{
                model:Loan,
                where:{
                    customer_id:req.body.customer_id
                }
            }]
            // group: ['group_no', 'center_no'],
        
        }).then(resul=>{
           // res.json(result)
            console.log("pidffhjjkff"+resul)
            if((resul==null)||(resul=='')){
                Customer.findOne({
                    where:{
                        customer_id:req.body.customer_id
                    }
                }).then(result=>{
                        Customer.findOne({
                            where:{
                                center_no:result.dataValues.center_no,
                                group_no:req.body.group_no
                            },attributes:['center_no','group_no',[Sequelize.fn('count',Sequelize.col('customer_id')),'Total_customres_amount']],
                            group:['center_no','group_no'],
                         }).then(res2=>{
                             console.log('centerrrrrrrr'+result.dataValues.center_no)
                             console.log('groupppppp'+req.body.group_no)
                     Group.findOne({
                      where:{
                          center_no:result.dataValues.center_no,
                          group_no:req.body.group_no
                      }
                  }).then(grp=>{
                      if(grp==''||grp==null){
                          console.log(408)
                           res.json(408)//group does not exists
                      }
                      else{
                        if(res2==null||res2.dataValues.Total_customres_amount<5){
                            console.log('else working')
                            Customer.update({
                                group_no:req.body.group_no
                            },{
                                where:{
                                    customer_id:req.body.customer_id
                                }
                            }).then(groupdata=>{
                                console.log('-------');
                                console.log(groupdata)
                                console.log('++++++++++');
                                res.json(200)
                            })
                           .catch(err =>{
                            console.log('-------');
                            console.log('404')
                            console.log('++++++++++');
                               res.json(404)
                           })
                             
                          }else {
                            console.log('-------');
                            // can't exceed
                            console.log('402')
                            console.log('++++++++++');
                            res.json(402)
                          }
                      }
                  })
                            
                }).catch(
                    err=>{
                        console.log("222222"+err)
                          res.send(err)
                    }
                )
            }).catch(err=>{
                res.send(err)
            })
            }else{
                console.log("loan exists")
                res.json(400)//loan exists
                
            }
        
        }).catch(err=>{
            res.send(err)
        })
    
      }


exports.get_centergroupdetails = (req,res)=>{
    
        Group.findAll({
            where:{
                center_no:req.body.center_no
            }     
        })
        .then(AllGroup=>{
            res.json(AllGroup)
        })
    }
    
exports.getGroups = (req,res)=>{
    Group.findAll({
        where:{
            center_no:req.body.cNo
        },
    }).then(result=>{
        res.json(result)
    }).catch(err=>{
        console.log(err);
    })
}

 exports.loadMembers = (req,res)=>{
 Customer.findAll({
     where:{
         center_no:req.body.center,
         group_no:{
            [Op.ne]: null
         }
     },
    //  group: ['group_no', 'center_no'],
     attributes:['customer_id','customer_name','group_no']

 }).then(result=>{
     res.json(result)
 }).catch(
     err=>{
         console.log(err)
     }
 )
}
 /*console.log("members working")
 Center.hasMany(Customer,{foreignkey:'center_no'})
 Customer.belongsTo(Center,{foreignkey:'center_no'})
 console.log("members workingnnnnnnnnnnnnnnnnn")

 Customer.findAll({
   /* where:{
        center_no:req.body.center,
        group_no:{
            [Op.ne]: null
         }
 },
 
  attributes:['customer_id','customer_name','group_no'],

     include:[{
         model:Center,
         attributes:['center_no'],
     }],



     where:{
        group_no:null
    },
    include:[{
        model:Center,
    attributes:['center_no','center_name']

    }]

     

 }).then(result=>{
    res.json(result)
}).catch(
    err=>{
        console.log(err)
    }
)
}*/



    exports.save_customer_group=(req,res)=>{
       // console.log(req.body.group_no);
        //console.log(req.body.customer_id);
        
         Customer.findOne({
             where:{
                 customer_id:req.body.customer_id
             }
         }).then(res1=>{
             Customer.findOne({
                 where:{
                     center_no:res1.dataValues.center_no,
                     group_no:req.body.group_no
                 },attributes:['center_no','group_no',[Sequelize.fn('count',Sequelize.col('customer_id')),'Total_customres_amount']],
                 group:['center_no','group_no'],
              }).then(res2=>{

    
                  if(res2==null||res2.dataValues.Total_customres_amount<5){
                    console.log('else working')
                    Customer.update({
                        group_no:req.body.group_no
                    },{
                        where:{
                            customer_id:req.body.customer_id
                        }
                    }).then(groupdata=>{
                        console.log('-------');
                        console.log(groupdata)
                        console.log('++++++++++');
                        res.json(200)
                    })
                   .catch(err =>{
                    console.log('-------');
                    console.log('404')
                    console.log('++++++++++');
                       res.json(404)
                   })
                     
                  }
                 

                  else {
                    console.log('-------');
                    // can't exceed
                    console.log('402')
                    console.log('++++++++++');
                    res.json(402)
                  }
             } ).catch(err=>{
                console.log('-------');
                console.log('403')
                console.log('++++++++++');
                res.json(403)
        })

        
    
       }).catch(err=>{
        console.log('-------');
        console.log('403')
        console.log('++++++++++');
           res.json(403)
       })

    }

       exports.loadCount = (req,res)=>{
        Customer.findAll({
            where:{
                center_no:req.body.center,
                group_no:{
                   [Op.ne]: null
                }
            },
           //  group: ['group_no', 'center_no'],
           attributes:['center_no','group_no',[Sequelize.fn('count',Sequelize.col('customer_id')),'Total_customres_amount']],
           group:['center_no','group_no'],
        }).then(result=>{
            res.json(result)
           
        }).catch(
            err=>{
                console.log(err)
            }
        )
       }





       exports.loadCountofallgroups = (req,res)=>{
        Group.hasMany(Customer,{foreignKey:'center_no'})
        Customer.belongsTo(Group,{foreignKey:'center_no'})
        Customer.findAll({
            where:{
                center_no:req.body.center_no,
                group_no:{
                   [Op.ne]: null
                }
            },
            
           //  group: ['group_no', 'center_no'],
           attributes:['center_no','group_no',[Sequelize.fn('count',Sequelize.col('customer_id')),'Total_customres_amount']],
           group:['center_no','group_no'],
        }).then(result=>{
            res.json(result)
            console.log(result)
           // var x=result.Total_customres_amount
            //console.log("hiiii bhss"+x)
        }).catch(
            err=>{
                console.log(err)
            }
        )
       }

/// Mobile
exports.getGroupsByCenterID=(req,res)=>{
    Group.findAll({
        where:{
            center_no:req.body.id
        }
    }).then(centers => {
        res.json(centers)
    })
}







