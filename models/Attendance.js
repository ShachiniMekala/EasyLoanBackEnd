const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'attendance',{
        attendance_id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        } ,
        customer_id:{
             type:Sequelize.INTEGER
        },
        attend_date:{
            type:Sequelize.DATE
       }
       
    },{
        timestamp:false,
        freezeTableName:true
    }
)