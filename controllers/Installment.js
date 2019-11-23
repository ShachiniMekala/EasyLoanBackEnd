const Installment=require("../models/Installment")
const Loan=require("../models/Loan")
const Loan_type=require("../models/Loan_type")
const Payment=require("../models/Payment")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const Customer=require("../models/Customer")
const Bulk=require("../models/Bulk")

process.env.SECRET_KEY='secret'

exports.get_all_installments = (req,res)=>{
    
    console.log('get all installment  working')
    Installment.findAll({
    })
    .then(AllCus=>{
        res.json(AllCus)
    })
}

exports.getInstallmentWithPaymentInDetail = (req, res) => {
    Loan.hasMany(Installment, {foreignKey: 'loan_no'})
    Installment.belongsTo(Loan, {foreignKey:'loan_no'})

    Installment.hasOne(Payment, {foreignKey: 'installment_no'})
    Payment.belongsTo(Installment, {foreignKey:'installment_no'})

    console.log('--------');
    
    console.log(req.body);
    

    Loan.findAll({
        where: {
            loan_no: req.body.loan_no
        },
        attributes: ['due_amount'],
        include:[
            {
                model:Installment,
                attributes: ['payment_date', 'total_amount', 'amount', 'installment_no', 'status_amount',
                //[Sequelize.fn('COUNT', 'installment_no'), 'count_installment_no']
            ],
                include: [
                    {
                        model: Payment,
                        attributes: ['payment_duedates', 'balance']
                    }
                ]
            },
        ]
    }).then(loan => {
        console.log(loan);
        res.json(loan);
    })
}


// add new installment
exports.post_new_installment = (req,res)=>{
    console.log('calling postttttttttttttttttttttttttttttttttttttttttttttttt')

    Loan.hasMany(Loan_type, {foreignKey: 'loan_index'})
    Loan_type.belongsTo(Loan, {foreignKey:'loan_index'})

    Loan.hasMany(Payment, {foreignKey: 'loan_no'})
    Payment.belongsTo(Loan, {foreignKey:'loan_no'})

    var currentDueDate = null;
    payable_amount_temp = 0;

    console.log(req.body.loan_no)
    Payment.findAll({
        where: {
            loan_no: req.body.loan_no
        },
        attributes: ['payment_duedates', 'payment_id', 'payable_amount'],
        order: [
            ['payment_id', 'DESC']
        ]
    }).then((paymentDetailsLast)=> {
        if(paymentDetailsLast.length != 0) {
            // console.log(paymentDetailsLast[0]);
            // console.log(paymentDetailsLast[0].payment_duedates);
            // console.log('[[[[[[[[[[[[[[[[');
            var date_var = paymentDetailsLast[0].payment_duedates.split('-');
            // console.log(paymentDetailsLast[0].payable_amount + '-------------------------');
            this.payable_amount_temp = paymentDetailsLast[0].payable_amount;
            currentDueDate = new Date(
                parseInt(date_var[0]),
                parseInt(date_var[1]-1),
                parseInt(date_var[2])
            );        
            currentDueDate.setMonth(currentDueDate.getMonth())
            currentDueDate.setDate(currentDueDate.getDate()+8)
        }

        // -------------------------------

        return new Promise(() => {
            Installment.findAll({
                where: {
                    loan_no: req.body.loan_no
                },
                order: [
                    ['installment_no', 'DESC']
                ]
            })
            .then(installment=>{
            
                var updatePayment = null;
                var date = new Date();
                 console.log('installmentttttttttttttttttttttttttttttttt'+installment[0]);
                // console.log(req.body.amount);
                // --------------------------------------
                var payment_state = null;
                // --------------------------------------


                // if(req.body.amount == null) {
                //     amount_var = 0;
                // } else {
                //     amount_var = req.body.amount
                // }

                amount_var = req.body.amount == null ? 0 : req.body.amount;
                total_amount_var = installment.length > 0 ? installment[0].total_amount + amount_var : amount_var;
                console.log('detailssssssssssssssssssssssssssssssssssssssssssssssssssssss')
                console.log(req.body.loan_no);
                console.log(amount_var);
                console.log(total_amount_var);
                console.log(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
                console.log(date.toLocaleTimeString());
                console.log(req.body.cashier_no);
                
                if(amount_var != 0) {
                    var formatedType = {
                        loan_no: req.body.loan_no,
                        amount: amount_var,
                        payment_status: '',
                        status_amount: 0,
                        total_amount: total_amount_var,
                        payment_date: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                        payment_time: date.toLocaleTimeString(),
                        entered_by: req.body.cashier_no
                    }
                    Loan.findOne({
                        where: {
                            loan_no: req.body.loan_no,
                        },
                        attributes: ['loan_no', 'customer_id', 'due_start_date','due_amount','total_amount'],
                        include:[
                            {
                                model:Loan_type,
                                attributes: ['initial_fees', 'due_amount'],
                            }, {
                                model: Payment,
                                attributes: ['payment_duedates'],
                                order: [
                                    ['payment_id', 'DESC']
                                ],
                                // offset: ((1-1)*30),
                                // limit: 1
                            }
                        ]
                        // console.log();
                        // -----------------------------------------------------------------
                    }).then((loanData) => {
                        console.log('//////////////////');
                        console.log(loanData);
                        // console.log(loanData.loan_type.due_amount)
                        // console.log(installment.);
                        // console.log('-------------');
                        // console.log(loanData.loan_type);
                        // console.log('-----+++++++++-----');
                        // console.log(loanData.payment);
                        
                        // console.log(']]]]]]]]]]]]]]]]]]]]');
                        // console.log(paymentDetailsLast.payment);
                        //  console.log(loanData.payment != null);
                        
                        if(loanData.payment != null) {
                            console.log('hellooooooooooooooooooooooooooooooo')
                            // payment_state = loanData.loan_type.due_amount;
                            // this.payable_amount_temp += loanData.loan_type.due_amount; 
                            // console.log(this.payable_amount_temp + '////////////////////');
                            // console.log('++++++++++++');
                            // var dateDetails = currentDueDate.split('-');
                            // console.log(loanData.payment.payment_duedates);
                            // console.log('111111111111111111');
                            // console.log(parseInt(dateDetails[2])+7);
                            updatePayment = {
                                loan_no: req.body.loan_no,
                                installment_no: 0,
                                customer_id: loanData.customer_id,
                                payable_amount: loanData.due_amount + paymentDetailsLast[0].payable_amount,
                                payment_date: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                                balance: loanData.total_amount - total_amount_var,
                                payment_duedates: currentDueDate,
                                due_amt:loanData.due_amount
                            }
                        } else {
                            console.log(';;;;;;;;;;;;;;;;;;;;;');
                            // console.log(loanData);
                            var date_var = loanData.due_start_date.split('-');
                            currentDueDate = new Date(
                                parseInt(date_var[0]),
                                parseInt(date_var[1]-1),
                                parseInt(date_var[2])
                            );        
                            currentDueDate.setMonth(currentDueDate.getMonth())
                            currentDueDate.setDate(currentDueDate.getDate()+1)
                            console.log(loanData.customer_id);
                            console.log(loanData.due_amount);
                            ( loanData.total_amount - total_amount_var);
                            console.log(currentDueDate);
                            console.log(loanData.due_amount);
                            
                            
                            
                            updatePayment = {
                                loan_no: req.body.loan_no,
                                installment_no: 0,
                                customer_id: loanData.customer_id,
                                payable_amount: loanData.due_amount,
                                payment_date: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                                balance: loanData.total_amount - total_amount_var,
                                payment_duedates: currentDueDate,
                                due_amt:loanData.due_amount
                            }
                            console.log(updatePayment)
                        }
                        // console.log('fessssssssssssssssssssssssssssssss'+initial_fee)
                        // console.log(loanData.loan_type.due_amount + 'pppppppppppppppppppppppppppppp' + paymentDetailsLast[0].payable_amount);
                        console.log('++++++++++++++++++');
                        console.log(updatePayment)
                        // console.log(initial_fee)
                        if(formatedType.total_amount == loanData.total_amount) {
                            formatedType.payment_status = 'settled';
                            formatedType.status_amount=0;
                           
                        } else {
                            if(formatedType.total_amount < updatePayment.payable_amount) {
                                formatedType.payment_status = 'shortage';
                                formatedType.status_amount=formatedType.total_amount-updatePayment.payable_amount
                               
                            } else if (formatedType.total_amount > updatePayment.payable_amount) {
                                formatedType.payment_status = 'excess';
                                formatedType.status_amount= formatedType.total_amount-updatePayment.payable_amount
                                
                            } else {
                                formatedType.status_amount = 0.00;
                                formatedType.payment_status = 'equal';    
                               
                            }
                        }     
                        // console.log('///////////installmentttttt///////////');
                        // console.log(formatedType.payment_status)
                        // console.log(formatedType);
                        Installment.create(formatedType).then((respo) => {
                            // console.log(respo.installment_no);
                            // console.log('--------------');
                       if(formatedType.payment_status == 'settled'){    
                        Loan.update({
                            current_paid_amount:total_amount_var,
                            current_balance:updatePayment.balance,
                            current_payable_amount:updatePayment.payable_amount,
                            settled_date:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
                        },{
                                where:{
                                     loan_no:req.body.loan_no
                                }
                            
                        }).then((loans)=>{
                            updatePayment.installment_no = respo.installment_no;
                            Payment.create(updatePayment).then((result) => {
                                // console.log('paymenttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')
                                // console.log(result)
                                // console.log(req.body);
                                // console.log('======////====');
                                Customer.update({
                                    group_no:null},{
                                        where:{
                                            customer_id:loanData.customer_id
                                        }
                                    }
                                ).then(cus=>{
                                    res.json(200);
                                    return;
                                }).catch(err=>{
                                    res.send(err)
                                })
                                
                            }).catch((err) => {
                                // console.log(err);
                                // console.log('errrrr2222222222222');
                                res.json(404);
                                return;
                            })
                        }).catch(err=>{
                            res.send(err)
                        })
                       }
                        else{
                            Loan.update({
                                current_paid_amount:total_amount_var,
                                current_balance:updatePayment.balance,
                                current_payable_amount:updatePayment.payable_amount},{
                                    where:{
                                         loan_no:req.body.loan_no
                                    }
                                
                            }).then((loans)=>{
                                updatePayment.installment_no = respo.installment_no;
                                Payment.create(updatePayment).then((result) => {
                                    console.log('paymenttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')
                                    console.log(result)
                                    // console.log(req.body);
                                    // console.log('======////====');
                                    res.json(200);
                                    return;
                                }).catch((err) => {
                                    // console.log(err);
                                    // console.log('errrrr2222222222222');
                                    res.json(404);
                                    return;
                                })
                            }).catch(err=>{
                                res.send(err)
                            })
                        }
                        })
                        // })
                        // console.log(']]]]]]]]]]]]]]]]]]]]');
                        // console.log(paymentDetailsLast.payment);
                        // console.log(paymentDetailsLast.payment_duedates);
                    }).catch((err) => {
                        // console.log(err);
                        // console.log('errrrr11111111111111');
                    })
                } else {
                    // console.log('errrrrr');
                    res.json(404);
                    return;
                }
            })

        // -------------------------------

    }).then(() => {
        }).then(() => {
            // console.log('5555555555555555');
            // console.log(updatePayment);
        }).catch((err) => {
            // console.log(err);
            // console.log('errrrrr----------------');u
            res.json(404)
            return;
        })
    })
}

exports.todayBulks=(req,res)=>{
var date = new Date();
Bulk.findAll({
    where:{
        bulk_date:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
    },attributes:['executive_no','bulk_amount','bulk_state']
}).then(details=>{
    res.json(details)
}).catch(err=>{
    res.send(err)
})
}


