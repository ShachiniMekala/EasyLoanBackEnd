/*const express=require("express")
const students=express.Router()
const cors=require("cors")
students.use(cors())



const student_cont=require("../controllers/Loans")

students.post('/students/register',student_cont.register)

module.exports = students*/
const express=require("express")
const loans=express.Router()
const cors=require("cors")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const loan_cont=require("../controllers/Loans")
const Loan=require("../models/Loan")
loans.use(cors())

process.env.SECRET_KEY='secret'

loans.get('/loanCount',loan_cont.loanCount)
loans.get('/full_details',loan_cont.get_all_loans_full_details)
//sajith
loans.get('/get_appliedList',loan_cont.getAppliedLoans)

loans.get('/get_approvedList',loan_cont.getApprovedLoans)

loans.get('/get_authorizedList',loan_cont.getAuthorizedLoans)

loans.post('/register',loan_cont.loan_register)

loans.get('/get_loantypes',loan_cont.get_Loantypes)

loans.post('/get_members',loan_cont.getSelectedCustomers)

loans.post('/selected_customer',loan_cont.get_Selected_Customer)

loans.post('/approve_loan',loan_cont.approveLoan)

loans.post('/authorize_loan',loan_cont.authorizeLoan)

loans.post('/disburse_loan',loan_cont.disburseLoan)

loans.post('/delete_loan',loan_cont.deleteLoan)

loans.post('/reverse_approval',loan_cont.reverseApproval)

loans.post('/reverse_athorize',loan_cont.reverseAuthorize)
//sanduni

loans.post('/get_loan',loan_cont.get_loan)
loans.post('/get_loancus',loan_cont.get_loancustomer)
loans.post('/reg_loanNo',loan_cont.reg_loanNo)
loans.get('/get_onecus',loan_cont.get_onecustomer)
loans.get('/get_loanType',loan_cont.get_loantype)
loans.get('/get_cusdetails',loan_cont.get_cusdetails)
loans.post('/dateRange',loan_cont.dateRange)
loans.get('/get_loanDisburse',loan_cont.get_loanDisburse)
loans.get('/get_loanSettle',loan_cont.get_loanSettle)
loans.get('/get_loanDetails',loan_cont.get_loanDetails)
loans.get('/get_loantotal',loan_cont.get_loantotal)
loans.get('/get_cancelLoans',loan_cont.get_cancelLoans)

/// Mobile
loans.post('/getLoanByCustomerID',loan_cont.getLoanByCustomerID);




module.exports=loans
