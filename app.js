const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
app.get("/failure", function(req, res){
    res.sendFile(__dirname + "/failure.html")
})
app.post("/", function(req, res){
    let fName = req.body.fName;
    let lName =  req.body.lName;
    let email = req.body.email
    console.log(fName, lName, email);
    let data = {
        members: [
            {
              email_address: email,
              status:"subscribed",
              merge_fields:{
                LNAME: lName,
                FNAME: fName
              }
            }
        ]
    }
let myData = JSON.stringify(data);
let url = "https://us17.api.mailchimp.com/3.0/lists/cf348a6b1d"
let options = {
    method: "POST",
    auth: "adeola:6f856583e9c90ac7c0de767287391273-us17"
}
const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    }else{
        res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data){
        console.log(JSON.parse(data));
    });
});
request.write(myData);
request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server running on port 3000");
});

