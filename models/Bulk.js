const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'bulk',{
        bulk_id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
        } ,
        cashier_no:{
             type:Sequelize.INTEGER
        },
        executive_no:{
            type:Sequelize.INTEGER
       },
       bulk_date:{
        type:Sequelize.INTEGER
       },
       bulk_amount:{
       type:Sequelize.DOUBLE
       },
       bulk_state:{
        type:Sequelize.STRING
       }
       
    },{
        timestamp:false,
        freezeTableName:true
    }
)