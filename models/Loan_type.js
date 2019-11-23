const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
'loan_type',
{
loan_index:{
type:Sequelize.INTEGER,
primaryKey:true

},


amount:{
    type:Sequelize.DOUBLE
},

interest_rate:{
    type:Sequelize.DOUBLE
},
interest:{
    type:Sequelize.DOUBLE
},
initial_fees:{
    type:Sequelize.DOUBLE
},
no_of_dues:{
    type:Sequelize.INTEGER
},
due_amount:{
    type:Sequelize.DOUBLE
}
},
{

 timestamps:false,  
 freezeTableName:true 
}





)