const Sequelize = require('sequelize')
const db = require("../databse/db.js")

module.exports = db.sequelize.define(
    'center_group',
    {
        
        
        center_no:{
            type:Sequelize.INTEGER,
            primaryKey:true

        },
        group_no:{
            type:Sequelize.INTEGER,
            primaryKey:true
        }

    },
    {
        timestamp: false,
        freezeTableName: true
    }
)