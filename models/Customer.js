const Sequelize=require('sequelize')
const db=require("../databse/db.js")


module.exports=db.sequelize.define(
    'customer',{
        customer_id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
       
        customer_name:{
             type:Sequelize.STRING
        },
        nic_no:{
            type:Sequelize.STRING
       },
       address:{
            type:Sequelize.STRING
       } ,
       birthdate:{
            type:Sequelize.STRING
            
       } ,
       age:{
            type:Sequelize.STRING
       },
        gender:{
            type:Sequelize.STRING
       },
       tp_no:{
            type:Sequelize.STRING
       },
       occupation:{
            type:Sequelize.STRING
       } ,
       center_no:{
          type:Sequelize.INTEGER
       }, 
       group_no:{
          type:Sequelize.INTEGER
       },
       guardian_name:{
            type:Sequelize.STRING
       } ,
       guardian_address:{
            type:Sequelize.STRING
       },
       guardian_nic:{
            type:Sequelize.STRING
       },
       guardian_tp:{
        type:Sequelize.STRING
   }
       
    },{
        timestamp:false,
        freezeTableName:true
    }
)