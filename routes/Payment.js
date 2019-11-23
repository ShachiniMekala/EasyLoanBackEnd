const express=require("express")
const payments=express.Router()
const cors=require("cors")
payments.use(cors())



const payment_cont=require("../controllers/Payment")


payments.post('/all_payments',payment_cont.get_all_payments)
/// Mobile
payments.post("/getBalanceByCustomerID",payment_cont.getPaymentByID);

module.exports = payments