const express=require("express")
const centers=express.Router()
const cors=require("cors")
centers.use(cors())

const center_cont=require("../controllers/Center")

centers.get('/',center_cont.get_all_centers)
// centers.get('/filter',center_cont.get_all_centers_for_filter_num_name)

centers.get('/get_centerdetails',center_cont.get_centerdetails)
centers.get('/get_customercenterdetails',center_cont.get_customercenterdetails)
centers.post('/register',center_cont.center_register)
centers.post('/get_namesofcustomers',center_cont.get_namesofcustomers)
centers.post('/get_countOfcustomers',center_cont.get_namesofcustomers)
centers.get('/get_centerdetailstoreport',center_cont.get_centerdetailstoreport)
centers.post('/get_centercounttoreport',center_cont.get_centercounttoreport)
centers.post('/delete_center',center_cont.delete_center)
centers.post('/update_center',center_cont.update_center)
centers.post('/getCentersByUserID',center_cont.getCentersByUserID)

module.exports = centers