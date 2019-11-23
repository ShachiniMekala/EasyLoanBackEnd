const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
    'center',{
        center_no:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        center_name:{
            type:Sequelize.STRING
        },
        location:{
            type:Sequelize.STRING
        },
        center_leader_id:{
            type:Sequelize.INTEGER
        },
        executive_no:{
            type:Sequelize.INTEGER
        },
        createdAt:{
            type:Sequelize.DATE
        },
        updatedAt:{
            type:Sequelize.DATE
        } 
    },{
        timestamp:false,
        freezeTableName:true
    }
) 
