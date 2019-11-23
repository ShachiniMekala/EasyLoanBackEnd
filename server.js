var express= require("express")
var cors=require("cors")
var bodyParser=require("body-parser")
var app=express()
var port=process.env.PORT || 3000
var http = require('http').createServer(app);

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({extended:false})
    
)


var path = require("path")
app.use(express.static(path.join(__dirname,'uploads')))

var Employees=require("./routes/Employees")
app.use("/employees",Employees)

var Customers=require("./routes/Customers")
app.use("/customers",Customers)

var Loans=require("./routes/Loans")
app.use("/loans",Loans)

var Installment=require("./routes/Installment")
app.use("/installment",Installment)

var Payment=require("./routes/Payment")
app.use("/payment",Payment)

var Centers=require("./routes/Centers")
app.use("/centers",Centers)

var Groups=require("./routes/Groups")
app.use("/center_group",Groups)

app.listen(port,function(){
    console.log("Server is running on port "+port)
}

)


