const Center=require("../models/Centers")
const Customer=require("../models/Customer")
const Group=require("../models/Group")
const Sequelize = require("sequelize")
process.env.SECRET_KEY='secret'
const Op = Sequelize.Op;


//charithaaaaaaaaaaaaaaaaaaa
exports.get_all_centers=(req,res)=>{
    Center.findAll({
    }).then(centers => {
        res.json(centers)
    })
}

//chathuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
exports.get_centerdetails = (req,res)=>{

   
    Center.findAll({
    })
    .then(AllCenter=>{
        res.json(AllCenter)
    })
}

exports.center_register=(req,res)=>{
console.log('backEndWorking');
const centerData={

  center_no:req.body.center_no,
  center_name:req.body.center_name,
  location:req.body.location,
  center_leader_id:req.body.center_leader_id,
  executive_id:req.body.executive_id,
  group_no:req.body.group_no


}
    Center.create(centerData)
    .then(center=>{
   /* let token=jwt.sign(center.dataValues,process.env.SECRET_KEY,{
    expiresIn:1440*/
    res.json(center)
   
    
    })
    //res.json({token:token})

    
    .catch(err=>{
    res.json(404)
    })

}

exports.get_customercenterdetails = (req,res)=>{
console.log('gettinggggggggggggggggggg')
Center.hasMany(Customer,{foreignKey:'center_no'})
Customer.belongsTo(Center,{foreignKey:'center_no'})
   
    Customer.findAll({
        where:{
            group_no:null
        },
        include:[{
            model:Center,
        attributes:['center_no','center_name']

        }]

    })
    .then(AllCenter=>{
        res.json(AllCenter)
    })
}


exports.get_namesofcustomers = (req,res)=>{
    
    Customer.findAll({

        where:{
            center_no:req.body.center_no,
            group_no:{
             [Op.ne]: null
           }
        },
       /*attributes:[[Sequelize.fn('count',Sequelize.col('customer_id')),'Total_ customres_amount']],
        group:['center_no'],*/
    })
    .then(AllCenter=>{
        res.json(AllCenter)
    })
}


exports.get_centercounttoreport = (req,res)=>{

   
    Center.findAll({

    attributes:[[Sequelize.fn('count',Sequelize.col('center_no')),'Total_ centers_amount']]

    })
    .then(AllCenter=>{
        res.json(AllCenter)
    })
}


exports.get_centerdetailstoreport = (req,res)=>{
    Center.findAll({
    attributes:['center_no','center_name','center_leader_id','executive_id','location'],
    })
    .then(AllCenter=>{
        res.json(AllCenter)
    })
}

/*exports.delete_center=(req,res)=>{
console.log('delete')
Center.destroy({
where:{
center_no:req.body.center_no

}

}).then(ex=>{
Group.destroy({
    where:{
        center_no:req.body.center_no
        
        }

}).then(result=>{
    console.log('deletedddddddd')
res.json(result)
}).catch(err=>{
    res.json(404)
})

}).catch(err=>{
    res.json(err)
})


}*/


exports.delete_center=(req,res)=>{
    console.log('deleteeeee')
    Customer.findAll({
        where:{
            center_no:req.body.center_no,
            /*group_no:{
                [Op.ne]: null
              }*/
        },
        attributes:['center_no','group_no','customer_id']
    
        
    }).then(result=>{
        console.log("heee"+result)
        console.log("hiooo"+result.customer_id)
    
       if(result!=''){
           res.json(300)
           
        }else{
            res.json(200)
            Group.destroy({
                where:{
                center_no:req.body.center_no
                
                }

                
                
                })
                .then(ex=>{
                Center.destroy({
                    where:{
                        center_no:req.body.center_no
                        
                        }
                
                })
                
                }).catch(err=>{
                    res.json(404)
                })
         
    
        }
       
    })
    
    .catch(err=>{
        res.json(405)
    })
    
    
    }
   
   



    exports.update_center=(req,res)=>{
        Customer.findAll({
            where:{
                customer_id:req.body.center_leader_id,
                center_no:req.body.center_no
            },
        }).then(respog=>{
            console.log("isss"+respog)
            if(respog==''){
                res.json(405)
            }else{
                console.log('bbbbaaaa')
                Center.update({
                    center_name:req.body.center_name,
                    location:req.body.location,
                    center_leader_id:req.body.center_leader_id,
                    executive_id:req.body.executive_id
                },{
                    where:{
                        center_no:req.body.center_no
                    }
                }).then(upcenter=>{
                res.json(200)
                
                }).catch(err=>{
                    res.json(505)
                })
            }
        }).catch(err=>{
            res.json(506)
        })
        
        }


        /// Mobile
exports.getCentersByUserID=(req,res)=>{
    Center.findAll({
        where:{
            executive_id:req.body.id
        }
    }).then(centers => {
        res.json(centers)
    })
}

