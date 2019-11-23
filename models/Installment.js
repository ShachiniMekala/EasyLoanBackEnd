const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'installment',{
        installment_no:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        } ,
        loan_no:{
             type:Sequelize.INTEGER
        },
        amount:{
            type:Sequelize.DOUBLE
       },
       payment_date:{
            type:Sequelize.DATE
       } ,
       payment_status:{
            type:Sequelize.STRING
       } ,
       status_amount:{
            type:Sequelize.DOUBLE
       },
       payment_time:{
            type:Sequelize.TIME
       } ,
       entered_by:{
            type:Sequelize.INTEGER
       },
       total_amount: {
        type:Sequelize.INTEGER
       }
    },{
        timestamp:false,
        freezeTableName:true
    }
)