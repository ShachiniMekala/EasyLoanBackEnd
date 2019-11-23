const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'deleted_loans',{
        loan_number:{
            type:Sequelize.INTEGER,
            primaryKey:true,
        } ,
        loan_type:{
             type:Sequelize.INTEGER
        },
        deleted_by:{
            type:Sequelize.INTEGER
       },
       customer:{
        type:Sequelize.INTEGER
       },
       deleted_date:{
       type:Sequelize.DATE
       }
       
    },{
        timestamp:false,
        freezeTableName:true
    }
)