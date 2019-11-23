const Loan=require("../models/Loan")
const  Customer=require("../models/Customer")
const Loan_Type=require("../models/Loan_type")
const Installment=require("../models/Installment")
const Payment=require("../models/Payment")
const Attendance=require("../models/Attendance")
const Center=require("../models/Centers")
const Cancelled=require("../models/Cancelled-loans")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const Sequelize=require('sequelize')
const Op = Sequelize.Op;

process.env.SECRET_KEY='secret'
/*
exports.register=(req,res)=>{
    const studentData={
    
    student_name:req.body.student_name,
    student_bod:req.body.student_bod,
    student_class:req.body.student_class
    
    }
    
    
        
        
        Loan.create(studentData)
        .then(student=>{
        let token=jwt.sign(student.dataValues,process.env.SECRET_KEY,{
        expiresIn:1440
        
        })
        res.json({token:token})
        })
        .catch(err =>{
        res.send('error:'+err)
        })
    
}*/


exports.loanCount=(req,res)=>{
    Loan.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('loan_no')), 'loan_count']]
      }).then(count=>{
          console.log(count)
            res.json(count)
      }).catch(err=>{
    res.send(err)
      })
      
}

    
// exports.get_loandetails = (req,res)=>{

   
//     Loan.findAll({
//     })
//     .then(AllLoan=>{
//         res.json(AllLoan)
//     })
// }



//charithaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

exports.get_all_loans_full_details = (req,res)=>{

    var sendArray=[];

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})

    Loan_Type.hasMany(Loan,{foreignKey:'loan_index'})
    Loan.belongsTo(Loan_Type,{foreignKey:{name: 'loan_index'}})

    Installment.belongsTo(Loan,{foreignKey:'loan_no'})
    Loan.hasMany(Installment,{foreignKey:{name: 'loan_no'}})

    Payment.belongsTo(Loan,{foreignKey:'loan_no'})
    Loan.hasOne(Payment,{foreignKey:{name: 'loan_no'}})

    Loan.findAll({
        where:{
            settled_date: { 
                       [Op.eq]: null
                       },
            disburse_state:'true'
        },
        attributes: ['loan_no', 'customer_id', 'due_start_date'],
        include: [
            {
                model: Loan_Type,
                attributes: ['amount', 'due_amount', 'initial_fees']
            }
            ,{
                model: Customer,
                attributes: ['customer_name','center_no', 'nic_no']
            }
            ,{
                model: Installment,
                attributes: ['amount', 'total_amount', 'payment_date', 'payment_status'],
                order: [
                    ['installment_no', 'DESC']
                ], 
                offset: ((1-1)*30),
                limit: 1
            }
            ,{
                model: Payment,
                attributes: ['balance', 'payment_id', 'payment_duedates', 'payable_amount'],
            }
        ],
    })
    .then(AllLoan=>{
        res.json(AllLoan)
    })
}



////////////////////////////////////////sajith

exports.getAppliedLoans = (req,res)=>{

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})

    Loan.findAll({
       where:{
        approve_state:'false'
       },
        include:[{
            model:Customer,
            attributes:['customer_id','customer_name','center_no','group_no'],
        }],attributes:['loan_no','loan_amount','loan_date'],
       

    }).then(result=>{
        res.json(result)
    })
}

exports.getApprovedLoans = (req,res)=>{

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})

    Loan.findAll({
       where:{
        approve_state:'true',
        authorize_state:'false'
       },
        include:[{
            model:Customer,
            attributes:['customer_id','customer_name','center_no','group_no'],
        }],attributes:['loan_no','loan_amount','approved_date'],
       

    }).then(result=>{
        res.json(result)
    })
}

exports.getAuthorizedLoans = (req,res)=>{

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})

    Loan.findAll({
       where:{
        authorize_state:'true',
        disburse_state:'false'
       },
        include:[{
            model:Customer,
            attributes:['customer_id','customer_name','center_no','group_no'],
        }],attributes:['loan_no','loan_amount','authorized_date'],
       

    }).then(result=>{
        res.json(result)
    })
}

exports.approveLoan=(req,res)=>{
console.log('backend approving')
    var today=new Date()
    Loan.update({
            approved_date:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
            approved_by:req.body.approved_by,
            approve_state:'true'},
        {where:{
            loan_no:req.body.loan_no
        }
    })
    .then(loan=>{
       res.json(200)
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.authorizeLoan=(req,res)=>{
    console.log('backend authorizing')
        var today=new Date()
        Loan.update({
                authorized_date:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
                authorized_by:req.body.authorized_by,
                authorize_state:'true'},
            {where:{
                loan_no:req.body.loan_no
            }
        })
        .then(loan=>{
           res.json(200)
        })
        .catch(err=>{
            res.send(err)
        })
    }

    exports.disburseLoan=(req,res)=>{
        console.log('backend disbursing')
        Loan.findOne({
            where:{
             loan_no:req.body.loan_no
            },attributes:['no_of_dues','due_start_date']
            
     
         }).then(result=>{
            var today=new Date();
            var startDate=new Date(result.dataValues.due_start_date);
            startDate.setDate(startDate.getDate()+(7*(result.dataValues.no_of_dues-1)))
    
            Loan.update({
                    disbursed_date:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
                    disbursed_by:req.body.disbursed_by,
                    disburse_state:'true',
                    end_date:startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate()
                },
                {where:{
                    loan_no:req.body.loan_no
                }
            })
            .then(loan=>{
               res.json(200)
            })
            .catch(err=>{
                res.send(err)
            })
         })
            
        }
exports.deleteLoan=(req,res)=>{

  Loan.findOne({
      where:{
          loan_no:req.body.loan_no
      }
  }).then(details=>{
    var today=new Date()
    const deleted={
        loan_number:req.body.loan_no,
        loan_type:details.dataValues.loan_index,
        deleted_by:req.body.approved_by,
        customer:details.dataValues.customer_id,
        deleted_date:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    }
    Cancelled.create(deleted)
         .then(loan=>{
            Loan.destroy({
                where: {
                 loan_no:req.body.loan_no
                }
              }).then(res=>{
                  res.json(200)
              }).catch(err=>{
                  res.send(err)
              })
        }).catch(err=>{
            res.send(err)
        })


  }).catch(err=>{
    res.send(err)
})

    
}
exports.reverseApproval=(req,res)=>{
    Loan.update({
        approved_date:null,
        approved_by:null,
        approve_state:'false'},
    {where:{
        loan_no:req.body.loan_no
    }
})
.then(loan=>{
   res.json(200)
})
.catch(err=>{
    res.send(err)
})
}
exports.reverseAuthorize=(req,res)=>{
    Loan.update({
        authorized_date:null,
        authorized_by:null,
        authorize_state:'false'},
    {where:{
        loan_no:req.body.loan_no
    }
})
.then(loan=>{
   res.json(200)
})
.catch(err=>{
    res.send(err)
})
}
 
exports.get_Loantypes=(req,res)=>{
    Loan_Type.findAll({
        attributes: ['loan_index','amount']
    })
    .then(types=>{
        res.json(types)
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.getSelectedCustomers=(req,res)=>{
    console.log('guaranterWorking')
      Customer.findOne({
          where:{
              customer_id:req.body.customer_id
          }
      })
      .then(result=>{
          console.log(result)
          Customer.findAll({
             where:{
                  center_no:result.dataValues.center_no,
                  group_no:result.dataValues.group_no,
                  customer_id:{
                    [Op.ne]:req.body.customer_id
                  }
             } 
          })
          .then(members=>{
              console.log('helooooooooooooo')
              console.log(members)
              res.json(members)
          }).catch(err2=>{
              console.log(err2)
              res.send(err2)
          })
      }).catch(err1=>{
        res.send(err1)
      })
}
exports.get_Selected_Customer=(req,res)=>{
    Customer.findOne({
        where:{
            customer_id:req.body.customer_id
        },
        attributes:['customer_id','birthdate']
    }).then(cus=>{
        console.log('ssssssssssssssssssssssssssssssssssssssssssssssssss')
        console.log(cus)
       if(cus==''||cus==null){
        res.json(400)
       }
       else{
        var today=new Date();
        var birthday=new Date(cus.dataValues.birthdate);
       var diff = Math.floor(today.getTime() - birthday.getTime());
       var day = 1000 * 60 * 60 * 24;
       var years = Math.floor(Math.floor( Math.floor(diff/day)/31)/12);
       var message =(years+1) +" years"

        Customer.update({
            age:message},{
            where:{
                customer_id:req.body.customer_id
            }
        })
        .then(result=>{
            console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrroooooooooooo')
            Customer.findOne({
                where:{
                    customer_id:req.body.customer_id
                },attributes:['customer_name','center_no','group_no','guardian_name','age']
            }).then(det=>{
                console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                console.log(det)
                if(det.dataValues.group_no==null){
                     res.json(401)
                }
               else{
                res.json(det)
               }
                
            }).catch(err=>{
                res.send(err)
        })
       }
    ).catch(err=>{
        res.send(err)
    })
   
}
    }).catch(err=>{
        res.send(err)
    })
}

exports.loan_register=(req,res)=>{
    console.log('calling reg')
    Loan_Type.findOne({
        where:{
            loan_index:req.body.loan_index
        }
    }).then(index=>{
        console.log("values"+index.dataValues.amount)
        console.log("valuesssssssssssssssssssssssssssssssssssssssssssss"+req.body.guarenter_id)
        
        Loan.findAll({
            where:{
                customer_id:req.body.customer_id,
                settled_date:null
            }
        }).then(loan=>{
            if((loan==null)||(loan=='')){
                var today=new Date()
                console.log(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
                const loanData={
                    loan_no:req.body.loan_no,
                    customer_id:req.body.customer_id,
                    loan_index:req.body.loan_index,
                    loan_date:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
                    loan_amount:index.dataValues.amount,
                    loan_interest:index.dataValues.interest,
                    total_amount:index.dataValues.initial_fees,
                    due_amount:index.dataValues.due_amount,
                    no_of_dues:index.dataValues.no_of_dues,
                    guarenter_id:req.body.guarenter_id,
                    due_start_date:req.body.due_start_date,
                    approve_state:'false',
                    authorize_state:'false',
                    disburse_state:'false',
                    
                 }
                 
                 Loan.create(loanData)
                 .then(loan=>{
                    res.json(loan)
                })
           }
           else{
                res.json(400)
           }
         }).catch(err =>{
                res.send('error:'+err)
            })
 })
}

 //sanduniiii

 exports.reg_loanNo=(req,res)=>{

    Payment.belongsTo(Loan,{foreignKey:'loan_no'})
    Loan.hasMany(Payment,{foreignKey:'loan_no'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Customer.hasMany(Attendance,{foreignKey:'customer_id'})
    Attendance.belongsTo(Customer,{foreignKey:'customer_id'})
    Loan.hasMany(Installment,{foreignKey:'loan_no'})
    Installment.belongsTo(Loan,{foreignKey:'loan_no'})

     Loan.findAll({
         where:{
             loan_no:req.body.loan_no
         },
         include:[{
            model:Customer,
            attributes:['customer_id','customer_name','center_no','nic_no','guardian_name','tp_no','address'],
            include:[{
                model:Attendance,
                attributes:['customer_id','attendance_id','attend_date'],
            }],

         },{
                 model:Payment,
                 attributes: ['payment_id','payment_date','payment_duedates'],
                           
                },
                 {
                   model:Installment,
                   attributes:['installment_no']
            }] 
 

    }).then(result=>{
        res.json(result)
    })

    }

  /*exports.allLoan = (req,res)=>{
     
    Payment.belongsTo(Loan,{foreignKey:'loan_no'})
    Loan.hasMany(Payment,{foreignKey:'loan_no'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.hasMany(Installment,{foreignKey:'loan_no'})
    Installment.belongsTo(Loan,{foreignKey:'loan_no'})
    
      

      Customer.findAll({
          where:{
            center_no:req.body.cNo
          },
          attributes: ['customer_id','customer_name','center_no'],

          include:[{
            model:Loan,
            attributes: ['loan_index','loan_no','loan_date','due_amount'],
            //group:['loan_no'],

            include:[{
             model:Payment,
             attributes: ['payment_id','payment_date','payment_duedates'],
                       
            },
             {
               model:Installment,
               attributes:['total_paid']
        }] 
     }],    


      }).then(result=>{
          res.json(result)
      }).catch(err=>{
          console.log(err)
      })
  }*/

exports.dateRange = (req,res)=>{

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Loan.hasMany(Installment,{foreignKey:'loan_no'})
    Installment.belongsTo(Loan,{foreignKey:'loan_no'})
    
    console.log(req.body.fd+'two dates working'+req.body.td)

            Customer.findAll({

                attributes:['customer_id','customer_name','center_no'],
        
                   include:[{
                       model:Loan,
                       where:{
                        loan_date: { 
                            [Op.between]: [req.body.fd,req.body.td] 
                        }
                       },
                      /* where:{
                           loan_date:{
                            [Op.and]:{
                                [Op.gte]:req.body.fd,
                                [Op.lte]:req.body.td
                            }
                           }
                       },*/
                       attributes: ['loan_index','loan_no','loan_date','due_start_date','approved_date','approved_by','disburse_state',
                       'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount',
                       [Sequelize.fn('count', Sequelize.col('Loans.loan_no')), 'Count_of_Loan'],
                       [Sequelize.fn('sum', Sequelize.col('Loans.loan_amount')), 'Total_Loan_Amount'],
                       [Sequelize.fn('sum', Sequelize.col('Loans.loan_interest')), 'Total_Interest'],
                       //[Sequelize.literal('COALESCE(Total_Loan_Amount, 0) + COALESCE(Loans.Total_Interest, 0)'), 'Total_Amount'],
                    ],
                                  
        
                       include:[
                        {
                   
                          model:Installment,
                          attributes:['total_amount']
               }]    
        
        
               }],
        
               group:['center_no'],
             
        
           }).then(result=>{
           //console.log(result.Customer.dataValues)
               res.json(result)
           })
        

   
}

//get all loan details
exports.get_loan = (req,res)=>{

    console.log('hiiiii')
    Loan.findAll({
    })
    .then(AllEmp=>{
        res.json(AllEmp)
    })
}

//join loan & customer tables and get all details
exports.get_loancustomer = (req,res)=>{

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})

    Loan.findAll({
       
        include:[{
            model:Customer,
            attributes:['customer_id','customer_name','center_no'],
        }],
       

    }).then(result=>{
        res.json(result)
    })
}

//get one customer's loan & customer details
exports.get_onecustomer = (req,res)=>{

    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})

    Loan.findAll({
       
        where:{
           loan_no: req.body.loan_no      
         }, order:[['updatedAt','DESC']],
        include:[{
            model:Customer,
            attributes:['customer_id','customer_name','center_no','nic_no','guardian_name','tp_no','address'],
        }],
       

    }).then(result=>{
        res.json(result)
    })
}

//join loan, customer, center, loan_type
exports.get_loantype=(req,res)=>{


    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    
    Loan.hasMany(Installment,{foreignKey:'loan_no'})
    Installment.belongsTo(Loan,{foreignKey:'loan_no'})
    
    Installment.hasOne(Payment, {foreignKey: 'installment_no'})
    Payment.belongsTo(Installment, {foreignKey:'installment_no'})

// ----------------------------

    Loan.hasMany(Payment,{foreignKey:'loan_no'})
    Payment.belongsTo(Loan,{foreignKey:'loan_no'})


    var firstArray = []
    var secondArray = []
    var thirdArray = []
    var forthArray = []
    return new Promise(() => {
        Installment.findAll({
            attributes:[[Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'installment_no'],'loan_no'],
            group:['loan_no'],
            where: {
                payment_status: { 
                [Op.eq]: 'shortage' 
                }
            },
        }).then(data => {
            firstArray = data;
            Installment.findAll({
                attributes:[[Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'installment_no'], 'loan_no'],
                group:['loan_no'],
            }).then((data)=> {
                secondArray = data;
                console.log(''+secondArray)
                console.log('last installment detailssssssssssssssssssssssssssssssssssssss')
                 console.log(firstArray);
                
                 
                // res.json(firstArray)
                // res.json(secondArray)
                // console.log(secondArray);
                firstArray.forEach(element => {
                    secondArray.forEach(elem => {
                        if(element.dataValues.installment_no == elem.dataValues.installment_no) {
                            thirdArray.push(element);
                            // break;
                        }
                     })
                     console.log('fsecond arrayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                 console.log(secondArray)
                    //console.log('thirdddddddddddd'+thirdArray)
                    // console.log(element);
                    // console.log('-------------');
                    // if(secondArray.includes(element)) {
                    //     thirdArray.push(element)
                    // }
                })

                // console.log(thirdArray.installment);
                

                // Installment.ForAll({
                //     attributes: ['installment_no', 'loan_no'],
                //     where: {

                //     }
                // })
                console.log('third arrayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                console.log(thirdArray)
                thirdArray.forEach(element => {
                    console.log(element.dataValues);
                    forthArray.push(element.dataValues.installment_no)
                })


                console.log('fourth arrayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                console.log(forthArray)
                // res.json(thirdArray)
            }).then(() => {
                
                console.log(forthArray);
                // res.json(forthArray)
                if((forthArray==null)||(forthArray=='')){
                   res.json(400)
                }
                else{
                    Installment.findAll({
                        where:{
                            installment_no: {
                                [Op.or]: forthArray
                            }
                        },
                        group:['loan_no'],
                       
                        // include:  -------------------------------------------------
                        include:[{
                                        model:Loan,
                                        attributes: ['loan_index','loan_date','due_start_date','approved_date','approved_by','disburse_state',
                                            'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount','end_date',
                                            //[Sequelize.fn('COUNT', 'Loan.installment_no'), 'count_installment'],
                                            [Sequelize.literal('COALESCE((Loan.due_amount), 0) * COALESCE(COUNT(Installment.installment_no), 0)'), 'sum_of_due']
                                           
                                         ],    
                                            include:[{
                                                model:Customer,
                                                attributes:['customer_id','customer_name','center_no']
                                            },{
                                                model:Installment,
                                                where:{
                                                    payment_status: { 
                                                        [Op.eq]: 'shortage' 
                                                        }},
                                                attributes:[[Sequelize.fn('COUNT', 'Installment.installment_no'), 'count_installment']]
                                            }],
                                           
                                    }, {
                                         model:Payment,
                                         attributes: ['payment_id', 'payment_duedates', 'balance', 'payable_amount',
                                         //[Sequelize.fn('min', Sequelize.col('balance')), 'balance'] ,
                                         //[Sequelize.fn('max', Sequelize.col('payable_amount')), 'payable_amount'],
                                         [Sequelize.literal('COALESCE(MAX(payable_amount), 0) / COALESCE((due_amt), 0)'), 'last_due']
                                     ],
                                         //required: false              
                                    }],
                            
                    }).then( data => {
                        res.json(data)
                    })
                    
                }
                
            })
            // data.forEach()
            // console.log(da);
            
            // res.json(data);
        })
    })
    

    /*Customer.findAll({

        attributes:['customer_id','customer_name','center_no'],

           include:[{
               model:Loan,
               attributes: ['loan_index','loan_no','loan_date','due_start_date','approved_date','approved_by','disburse_state',
               'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount',],
                          

               include:[
                {
           
                  model:Installment,
                  where:{
                    payment_status: { 
                        [Op.eq]: 'shortage' 
                    }
                   },
                  limit:1,
                  attributes:['total_amt','payment_date','payment_status','status_amount'],
                  order: [
                    ['installment_no', 'DESC']
                ]  
             } // },{
            //     model:Payment,
            //     limit:1,
            //     attributes: ['payment_id','payment_duedates','balance'],
            //     order: [
            //         ['payment_id', 'DESC']
            //     ]
                
            // }
       ]  

       }],
       

   }).then(result=>{
   //console.log(result.Customer.dataValues)
       res.json(result)
   })*/






//    -----------------------------------------------

//    Installment.findAll({
// //         attributes: [[Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'installment_number']],
// //         group: ['loan_no'],
// //         where:{
// //            payment_status: { 
// //                [Op.eq]: 'shortage' 
// //             }
// //         },
// //     }).then((data) => {
// //         // console.log(data[0]);
// //         fistArray = data;
// //         // res.json(data)
// //         Installment.findAll({
// //             attributes: [[Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'installment_number']],
// //             group: ['loan_no']
// //         }).then((data) => {
// //             // console.log('------------');
// //             // console.log(data[0]);
// //             secondArray = data
// //             // res.json(data);
// //             // console.log(fistArray);
// //             // console.log(secondArray);
// //             var thirdArray = []
// //             fistArray.forEach(element => {
// //                 if(secondArray.installment_no.includes(element.installment_no)) {
// //                     thirdArray.push(element);
// //                     console.log(true);
// //                 }
// //             })
// //             res.json(fistArray);
// //         })


// //         // res.json(data)
// //     })
    
    
    
    
//     // includeIgnoreAttributes: false,     
//         attributes:[[Sequelize.fn('COUNT', 'Installment.installment_no'), 'count_installment_no'], [Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'installment_number'],
//         [Sequelize.fn('max', Sequelize.col('Installment.total_amt')), 'total_amt'],
//         [Sequelize.fn('max', Sequelize.col('Installment.payment_date')), 'payment_date'],'payment_status','status_amount','loan_no'],
//     // attributes:['installment_no', 'payment_date','payment_status','status_amount','loan_no'],   
//     group:['loan_no'],  
//     order: Sequelize.literal('Installment.installment_no DESC'),
//     // [
//     //     // [Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'DESC'],
//     //     // ['loan_no']
        
//     // ],
//        where:{
//            payment_status: { 
//                [Op.eq]: 'shortage' 
//             }
//         },

//        include:[{
//            model:Loan,
//            attributes: ['loan_index','loan_date','due_start_date','approved_date','approved_by','disburse_state',
//                'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount',
//                [Sequelize.fn('COUNT', 'Loan.installment_no'), 'count_installment'],
//                //[Sequelize.literal('SUM(loan_amount * due_amount)'), 'result']
//                //[Sequelize.fn('SUM', Sequelize.col('loan_amount') + '*' + Sequelize.col('due_amount')), 'result']
//                //[Sequelize.fn('SUM', Sequelize.col('loan_amount'), Sequelize.literal('*'), Sequelize('due_amount')), 'score']
//              // Sequelize.literal('Loan.count_installment * 10'), 'NewPrice',
//              [Sequelize.literal('COALESCE((Loan.due_amount), 0) * COALESCE(COUNT(Installment.installment_no), 0)'), 'sum_of_due']
               
//             ],    
//                include:[{
//                    model:Customer,
//                 //    through: {
//                        attributes:['customer_id','customer_name','center_no']
//                 //    }
//                }
//                ]
               
//        }, {
//             model:Payment,
//             // where: {
//             //     // loan_no: Installment.loan_no,
//             //     installment_no: installment_number
//             // },
//             // through: {
//             //     attributes: []    
//             // },
//             attributes: ['payment_id', 'payment_duedates',
//             [Sequelize.fn('min', Sequelize.col('balance')), 'balance'] ,
//             [Sequelize.fn('max', Sequelize.col('payable_amount')), 'payable_amount'],
//             [Sequelize.literal('COALESCE(MAX(Payment.payable_amount), 0) / COALESCE((Payment.due_amt), 0)'), 'last_due']
//         ],
//             required: false              
//        }],

//        required: false
//     //   ------------------------------------------
    
//     // Payment.findAll({
//     //     attributes: ['payment_id', [Sequelize.fn('max', Sequelize.col('Installment.installment_no')), 'installment_no'],'payment_id', 'payment_duedates', 'balance', 'payable_amount'] ,
//     //     include: [{
//     //         model:Loan,
//     //             attributes: ['loan_index','loan_date','due_start_date','approved_date','approved_by','disburse_state',
//     //                 'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount',
//     //             ],    
//     //                 include:[{
//     //                     model:Customer,
//     //                     attributes:['customer_id','customer_name','center_no'],
//     //                 }
//     //                 ]
//     //     }, {
//     //         model: Installment,
//     //         attributes: [ 'installment_no', 'payment_date','payment_status','status_amount','loan_no'],
//     //         where:{
//     //             payment_status: { 
//     //                 [Op.eq]: 'shortage' 
//     //             }
//     //         },
//     //     }, 
//     // ], 
//     // group:['Payment.loan_no'],
//     }).then(result=>{
    
//         res.json(result)
//     })

}

exports.get_loantotal=(req,res)=>{


    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Loan.hasMany(Installment,{foreignKey:'loan_no'})
    Installment.belongsTo(Loan,{foreignKey:'loan_no'})
    Loan.hasMany(Payment, {foreignKey: 'loan_no'})
    Payment.belongsTo(Loan, {foreignKey:'loan_no'})
    

    Customer.findAll({

        attributes:['customer_id','customer_name','center_no'],

           include:[{
               model:Loan,
               attributes: ['loan_index','loan_no','loan_date','due_start_date','approved_date','approved_by','disburse_state',
               'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount',
               [Sequelize.fn('count', Sequelize.col('Loans.loan_no')), 'Count_of_Loan'],
               [Sequelize.fn('sum', Sequelize.col('Loans.loan_amount')), 'Total_Loan_Amount'],
               [Sequelize.fn('sum', Sequelize.col('Loans.loan_interest')), 'Total_Interest'],
               [Sequelize.fn('sum', Sequelize.col('Loans.total_amount')), 'Total_Amount'],
               [Sequelize.fn('sum', Sequelize.col('Loans.current_paid_amount')), 'Total_Paid'],
               [Sequelize.fn('sum', Sequelize.col('Loans.current_balance')), 'Total_Balance']
            ],
                          

               include:[
                {
           
                  model:Installment,
                  limit:1,
                  //attributes:[[Sequelize.fn('sum', Sequelize.col('Loans.total_amount')), 'Total_Paid']],
                  order: [
                    ['installment_no', 'DESC']
                ],
            },{
                model:Payment,
                limit:1,
                attributes:['balance'],
                order: [
                  ['payment_id', 'DESC']
              ],
            }
       ]    


       }],

       group:['center_no'],
     

   }).then(result=>{
   //console.log(result.Customer.dataValues)
       res.json(result)
   })

}

exports.get_loanDetails=(req,res)=>{


    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    

    Customer.findAll({

        attributes:['customer_id','customer_name','center_no'],

           include:[{
               model:Loan,
               attributes: ['loan_index','loan_no','loan_date','due_start_date','approved_date','approved_by','disburse_state',
               'disbursed_date','disbursed_by','total_amount','loan_amount','loan_interest','no_of_dues','due_amount','end_date'
            ],
    
       }],
     

   }).then(result=>{
   //console.log(result.Customer.dataValues)
       res.json(result)
   })

}
 

exports.get_cusdetails=(req,res)=>{ 
   
    Payment.belongsTo(Loan,{foreignKey:'loan_no'})
    Loan.hasMany(Payment,{foreignKey:'loan_no'})
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Loan.hasMany(Installment,{foreignKey:'loan_no'})
    Installment.belongsTo(Loan,{foreignKey:'loan_no'})
    

    Customer.findAll({

        attributes:['customer_id','customer_name','center_no'],

           include:[{
               model:Loan,
               attributes: ['loan_index','loan_no','loan_date','due_amount'],
               //group:['loan_no'],

               include:[{
                model:Payment,
                limit:1,
                attributes: ['payment_id','payment_duedates'],
                order: [
                    ['payment_id', 'DESC']
                ]
                          
               },
                {
                  model:Installment,
                  limit:1,
                  attributes:['total_amount','payment_date','payment_status'],
                  order: [
                    ['installment_no', 'DESC']
                ]
           }] 
        }],    

      
     

   }).then(result=>{
   //console.log(result.Customer.dataValues)
       res.json(result)
   })

}

exports.get_loanDisburse=(req,res)=>{
 
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Customer.belongsTo(Center,{foreignKey:'center_no'})
    Center.hasMany(Customer,{foreignKey:'center_no'})
    

    Loan.findAll({

        attributes: ['loan_index','loan_no','loan_date','due_amount','loan_amount','no_of_dues',
        'disbursed_date','disbursed_by','disburse_state','due_start_date','settled_date'],
        
        where:{
            disburse_state:{
                [Op.like]: 'true%'
            }
        },

           include:[{
               model:Customer,
               attributes: ['customer_id','customer_name'],

               include:[{
                model:Center,
                attributes:['center_no','center_name'],
            
           }] 
        }],    
   

   }).then(result=>{
   //console.log(result.Customer.dataValues)
       res.json(result)
   })

}

exports.get_loanSettle=(req,res)=>{
 
    Loan.belongsTo(Customer,{foreignKey:'customer_id'})
    Customer.hasMany(Loan,{foreignKey:'customer_id'})
    Customer.belongsTo(Center,{foreignKey:'center_no'})
    Center.hasMany(Customer,{foreignKey:'center_no'})
    

    Loan.findAll({

        attributes: ['loan_index','loan_no','loan_date','due_amount','loan_amount','no_of_dues',
        'disbursed_date','disbursed_by','disburse_state','due_start_date','settled_date'],
      
        where:{
            settled_date:{
                [Op.ne]: null
            }
        },

           include:[{
               model:Customer,
               attributes: ['customer_id','customer_name'],

               include:[{
                model:Center,
                attributes:['center_no','center_name'],
            
           }] 
        }],    
   

   }).then(result=>{
   //console.log(result.Customer.dataValues)
       res.json(result)
   })

}

exports.get_cancelLoans=(req,res)=>{
    Cancelled.findAll({
       
      }).then(data=>{
          console.log(data)
            res.json(data)
      }).catch(err=>{
    res.send(err)
      })
}

 
 /// Mobile
 exports.getLoanByCustomerID=(req,res)=>{

    console.log(" ========== Called " + req.body.id)

    Loan.findOne({
        where:{
            customer_id:req.body.id,
            settled_date:null
        }
    }).then(centers => {
        res.json({
            "loan_no" : centers.dataValues.loan_no,
            "loan_amount" : centers.dataValues.loan_amount,
            "due_amount" : centers.dataValues.due_amount
        })
    })
}

 