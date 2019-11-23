const express=require("express")
const installment=express.Router()
const cors=require("cors")
installment.use(cors())



const installment_cont=require("../controllers/Installment")

// installment.post('/new',installment_cont.post_new_installment)

 installment.post('/new',installment_cont.post_new_installment)
installment.post('/installment_payment', installment_cont.getInstallmentWithPaymentInDetail)
installment.get('/todayBulks',installment_cont.todayBulks)
// installment.post('/emp_register',installment_cont.emp_register)



module.exports = installment