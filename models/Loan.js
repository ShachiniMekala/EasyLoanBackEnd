
const Sequelize=require('sequelize')
const db=require("../databse/db.js")

module.exports=db.sequelize.define(
'loan',
{

loan_no:{
type:Sequelize.INTEGER,
primaryKey:true,
autoIncrement:true

},


customer_id:{
    type:Sequelize.INTEGER
    
    },

loan_index:{
    type:Sequelize.INTEGER
        
    }, 
    
    loan_date:{
        type:Sequelize.STRING
            
        }, 
        
        loan_amount:{
            type:Sequelize.DOUBLE
                
            }, 

            loan_interest:{
                type:Sequelize.DOUBLE
                    
                }, 

                total_amount:{
                    type:Sequelize.DOUBLE
                        
                    }, 

                    due_amount:{
                        type:Sequelize.DOUBLE
                            
                        }, 

                        no_of_dues:{
                            type:Sequelize.INTEGER
                                
                            }, 

                            guarenter_id:{
                                type:Sequelize.INTEGER
                                    
                                }, 

                                due_start_date:{
                                    type:Sequelize.STRING
                                        
                                    },
                                    end_date:{
                                        type:Sequelize.STRING
                                    },
                                    approve_state:{
                                        type:Sequelize.STRING
                                    },
                                    authorize_state:{
                                        type:Sequelize.STRING
                                    },
                                    disburse_state:{
                                        type:Sequelize.STRING
                                    },
                                    approved_date:{
                                        type:Sequelize.STRING
                                    },
                                    approved_by:{
                                        type:Sequelize.INTEGER
                                    },
                                    authorized_date:{
                                        type:Sequelize.STRING
                                    },
                                    authorized_by:{
                                        type:Sequelize.INTEGER
                                    },
                                    disbursed_date:{
                                        type:Sequelize.STRING
                                    },
                                    disbursed_by:{
                                        type:Sequelize.INTEGER
                                    },
                                    settled_date:{
                                        type:Sequelize.STRING
                                    },
                                    current_paid_amount:{
                                        type:Sequelize.DOUBLE
                                    },
                                    current_balance:{
                                        type:Sequelize.DOUBLE
                                    },
                                    current_payable_amount:{
                                        type:Sequelize.DOUBLE
                                    }

        
            
    
},
{

 timestamps:false,  
 freezeTableName:true 
}





)