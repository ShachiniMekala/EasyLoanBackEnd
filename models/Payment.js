const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'payment',{
        payment_id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        loan_no:{
            type:Sequelize.INTEGER
        },
        payment_date:{
            type:Sequelize.DATE
        },
        balance:{
            type:Sequelize.DOUBLE
        },
        installment_no:{
            type:Sequelize.DOUBLE
         },
       payable_amount:{
           type:Sequelize.DOUBLE
       },
        customer_id:{
            type:Sequelize.INTEGER
        },
        payment_duedates : {
            type:Sequelize.DATE
        },
        due_amt:{
            type:Sequelize.DOUBLE
        }
    },{
        timestamp:false,
        freezeTableName:true
    }
)
