const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'employees',{
        employee_no:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        } ,
        employee_name:{
             type:Sequelize.STRING
        },
        employee_img:{
             type:Sequelize.STRING
        },
        gender:{
            type:Sequelize.STRING
       },
       birthdate:{
            type:Sequelize.STRING
       },
        nic_no:{
            type:Sequelize.STRING
       } ,
        address:{
            type:Sequelize.STRING
       } ,
        tp_no:{
            type:Sequelize.STRING
       },
        email_adress:{
            type:Sequelize.STRING
       },
        employee_type:{
            type:Sequelize.STRING
       } ,
        epf_no:{
            type:Sequelize.STRING
       } ,
        etf_no:{
            type:Sequelize.STRING
       } ,
        e_password:{
            type:Sequelize.STRING
       },
        password_hint :{
            type:Sequelize.STRING
       }
       
    },{
        timestamp:false,
        freezeTableName:true
    }
)