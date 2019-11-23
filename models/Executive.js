const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'executive',{
        employee_no:{
            type:Sequelize.INTEGER,
            primaryKey:true
        } ,
        bike_no :{
            type:Sequelize.STRING
       }
       
    },{
        timestamp:false,
        freezeTableName:true
    }
)