const Repayment=require("../models/Payment")
const Customer=require("../models/Customer")
const Installment=require("../models/Installment")
const Loan=require("../models/Loan")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

process.env.SECRET_KEY='secret'


exports.get_all_payments=(req,res)=>{

    Repayment.belongsTo(Loan, {foreignKey: 'loan_no'})
    Loan.hasMany(Repayment, {foreignKey:'loan_no'})

    Loan.belongsTo(Customer, {foreignKey: 'customer_id'})
    Customer.hasMany(Loan, {foreignKey:'customer_id'})

    Loan.hasMany(Installment, {foreignKey: 'loan_no'})
    Installment.belongsTo(Loan, {foreignKey:'loan_no'})


    Repayment.findAll({
        attributes: ['balance', 'payment_date'],
        include:[{
            model:Loan,
            attributes: ['customer_id', 'loan_no'],
            include:[{
                model: Customer,
                attributes: ['customer_id', 'customer_name', 'nic_no']
            }, {
                model: Installment,
                attributes: ['amount', 'total_amount'],
                order: [
                    ['installment_no', 'DESC']
                ]
            }]
        }
    ]
    }).then(repayment=>{

       console.log(repayment)
       res.json(repayment)
    })
    .catch(err=>{
        res.send('error : '+err)
})
}
 
exports.getPaymentByID=(req,res)=>{
    Repayment.findOne({
        where:{
            customer_id:req.body.id
        }
    }).then(payment => {
        res.json({
            "balance" : payment.dataValues.balance,
           
        })
    })
}