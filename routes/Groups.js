const express = require("express")
const groups = express.Router()
const cors = require("cors")
groups.use(cors())

const group_cont = require("../controllers/Groups")


process.env.SECRET_KEY='secret'


//  add group
groups.post('/group_no',group_cont.add_group)
groups.get('/get_centergroupdetails',group_cont.get_centergroupdetails)
groups.post('/save_customer_group',group_cont.save_customer_group)
groups.post('/getGroupNo',group_cont.getGroups)
groups.post('/loadMembers',group_cont.loadMembers)
groups.post('/loadCount',group_cont.loadCount)
groups.post('/addExtra_group',group_cont.addExtra_group )
groups.post('/loadCountofallgroups',group_cont.loadCountofallgroups )
groups.post('/changecustomergroup',group_cont.changecustomergroup )

/// Mobile
groups.post('/getGroupsByCenterID',group_cont.getGroupsByCenterID )

module.exports = groups