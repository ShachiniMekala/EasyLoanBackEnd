const express=require("express")
const customers=express.Router()
const cors=require("cors")
customers.use(cors())



const customer_cont=require("../controllers/Customers")



customers.post('/cus_register',customer_cont.cus_register)
customers.get('/cusCount',customer_cont.cusCount)
customers.get('/get_cus',customer_cont.get_customers)
customers.get('/get_all_centers',customer_cont.get_centers)
customers.post('/view_profile',customer_cont.viewprofile)
//customers.post('/cus_editprofile',customer_cont.cus_editprofile)
customers.post('/cus_edit',customer_cont.edit_cus)

customers.get('/get_center',customer_cont.get_center)

customers.post('/getCustomersByGroupIDandCenterID',customer_cont.getMembersByGroupIDandCenterID);
customers.post('/getCustomerByMemID',customer_cont.getMemberByMEMID);
customers.post('/getCustomerByNIC',customer_cont.getMemberByNIC);

module.exports = customers