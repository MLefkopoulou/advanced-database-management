var express = require('express');
var bodyParser = require('body-parser');
//connect to mongodb
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/real_estate_db",{ useNewUrlParser: true ,useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
//creat
const memberSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,"Please enter username"]
  },
  email:{
    type:String,
  },
  password:String,
  phone:String


});
const Member = mongoose.model("member",memberSchema);


//for real estate agency properties
const real_estateSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true,"Please enter title"]
  },
  case : String,
  real_estate_type : String,
  building : String ,
  town : String ,
  region : String ,
  address : String ,
  area  : Number,
  price : Number,
  floor : Number,
  parking : String,
  heating_system : String,
  rooms : Number,
  iner_char : Array,
  outer_char : Array,
  extra_char : Array,
    agent :String,
  year_of_construct : Number,
  last_update : String,
  details : String
});
const Real_estate = mongoose.model("real_estate",real_estateSchema);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.listen(3000, function(){

//get methods for login page
app.get("/login",function(request,response){
//take the current directory path with __dirname
  response.render('login',{user_error_login :parseInt(0) , password_error_login : parseInt(0) , user_error_signup : parseInt(0)});
});
app.get("/css/login.css",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/css/login.css");
});

///////////////////////////////////images get request //////////////////////////////////////////////////////
app.get("/js/login.js",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/js/login.js");
});
app.get("/images/e-spiti-logo.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/e-spiti-logo.jpg");
});
app.get("/images/house4.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/house4.jpg");
});
app.get("/images/monokatoikia.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/monokatoikia.jpg");
});
app.get("/images/studio.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/studio.jpg");
});
app.get("/images/work.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/work.jpg");
});
app.get("/images/land.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/land.jpg");
});
app.get("/images/department.jpg",function(request,response){
//take the current directory path with __dirname
response.sendFile(__dirname+"/images/department.jpg");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/main",function(request,response){
//take the current directory path with __dirname


    Real_estate.find( {}, function (err, result) {
      if (err) {
          console.log(err);
      }else{
        console.log(result.length);
          response.render('e-spiti',{data:result , username : 'nologin',page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
      }
    });


});

app.post("/main",function(request,response){
//take the current directory path with __dirname


    Real_estate.find( {}, function (err, result) {
      if (err) {
          console.log(err);
      }else{
        console.log(result.length);
          response.render('e-spiti',{data:result , username : request.body.username,page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
      }
    });


});
//post method for login
app.post("/login",function(req,res){
  var ckeck_username = req.body.login_user;
  console.log(ckeck_username);
  Member.findOne( { username: ckeck_username }, function (err, result) {
    if (err) {
        console.log(err);
    }
    if (!result) {
      console.log("error user");
      res.render('login',{user_error_login : parseInt(1) , password_error_login : parseInt(0) , user_error_signup : parseInt(0)});
    }
    if (result) {
      console.log(result.password);
      console.log(req.body.login_password);
      if(result.password == req.body.login_password){
        console.log("correct you can connect");
        Real_estate.find( {}, function (err, result) {
          if (err) {
              console.log(err);
          }else{
            console.log(result.length);
              res.render('e-spiti',{data:result , username :ckeck_username,page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
          }
        });

      }else{
        console.log("error password");
        res.render('login',{user_error_login : parseInt(0) , password_error_login : parseInt(1) , user_error_signup : parseInt(0)});
      }
    }
  });


});
app.post("/signup", function(req,res){
  Member.findOne( { username: req.body.username }, function (err, result) {
    if (err) {
        console.log(err);
    }
    if (!result) {
      const newmember = new Member({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        phone : req.body.phone
      });

      newmember.save();
      Real_estate.find( {}, function (err, result) {
        if (err) {
            console.log(err);
        }else{
          console.log(result.length);
            res.render('e-spiti',{data:result , username :req.body.username,page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
        }
      });


    }
    if (result) {

        console.log("user exist");
        res.render('login',{user_error_login : parseInt(0) , password_error_login : parseInt(0) , user_error_signup : parseInt(1)});

    }
  });
});


app.post("/one_property",function(req, res){
         console.log(req.body.property_id);
          Real_estate.findById(req.body.property_id, function (err, property) {

            if(err){
                console.log(err);
            }else{
              console.log( req.body.username);
              console.log( property.agent);
                res.render('property',{prop_data:property , username : req.body.username});
            }
          });

});
//sales
app.post("/all_sales",function(req, res){

          Real_estate.find( {case:'Πώληση'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'ALL THE PROPERTIES FOR SALE', page_case:'sale',real_estate_type:'notype',building:'nobuilding'});
            }
          });

});
app.post("/home_sales",function(req, res){

          Real_estate.find( {case:'Πώληση', real_estate_type:'Σπίτι'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'HOME SALES', page_case:'sale',real_estate_type:'home',building:'nobuilding'});
            }
          });

});
app.post("/land_sales",function(req, res){

          Real_estate.find( {case:'Πώληση', real_estate_type:'Γη'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'LAND SALES', page_case:'sale',real_estate_type:'land',building:'nobuilding'});
            }
          });

});
app.post("/business_sales",function(req, res){

          Real_estate.find( {case:'Πώληση', real_estate_type:'Εργασία'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username :req.body.usernamemy,page_title:'BUSINNES SALES', page_case:'sale',real_estate_type:'work',building:'nobuilding'});
            }
          });
});
app.post("/department_sales",function(req, res){

          Real_estate.find( {case:'Πώληση', real_estate_type:'Σπίτι',building:'Διαμέρισμα'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'DEPARTMENT SALES', page_case:'sale',real_estate_type:'home',building:'department'});
            }
          });

});
app.post("/monokatoikia_sales",function(req, res){

          Real_estate.find( {case:'Πώληση', real_estate_type:'Σπίτι',building:'Μονοκατοικία'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'DETACHED HOUSES SALES', page_case:'sale',real_estate_type:'home',building:'monokatikia'});
            }
          });

});
app.post("/studio_sales",function(req, res){

          Real_estate.find( {case:'Πώληση', real_estate_type:'Σπίτι',building:'Στούντιο'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'STUDIOS SALES', page_case:'sale',real_estate_type:'home',building:'studio'});
            }
          });

});
//rentals
app.post("/all_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'ALL RENTALS', page_case:'rent',real_estate_type:'notype',building:'nobuilding'});
            }
          });

});
app.post("/home_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση', real_estate_type:'Σπίτι'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'HOME RENTALS', page_case:'rent',real_estate_type:'home',building:'nobuilding'});
            }
          });

});
app.post("/land_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση', real_estate_type:'Γη'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'LAND RENTALS', page_case:'rent',real_estate_type:'land',building:'nobuilding'});
            }
          });

});
app.post("/business_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση', real_estate_type:'Εργασία'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'BUSINNES RENTALS', page_case:'rent',real_estate_type:'work',building:'nobuilding'});
            }
          });
});
app.post("/department_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση', real_estate_type:'Σπίτι',building:'Διαμέρισμα'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'DEPARTMENT RENTALS', page_case:'rent',real_estate_type:'home',building:'department'});
            }
          });

});
app.post("/monokatoikia_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση', real_estate_type:'Σπίτι',building:'Μονοκατοικία'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'DETACHED HOUSES RENTALS', page_case:'rent',real_estate_type:'home',building:'monokatikia'});
            }
          });

});
app.post("/studio_rentals",function(req, res){

          Real_estate.find( {case:'ενοικίαση', real_estate_type:'Σπίτι',building:'Στούντιο'}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
                res.render('e-spiti',{data:result , username : req.body.usernamemy,page_title:'STUDIOS RENTALS', page_case:'rent',real_estate_type:'home',building:'studio'});
            }
          });

});
app.post("/my",function(req, res){
var title = 'PROPERTIES THAT '+req.body.usernamemy +' HAS ADD';
          Real_estate.find( {agent:req.body.usernamemy}, function (err, result) {
            if (err) {
                console.log(err);
            }else{
              console.log(result.length);
              res.render('my',{data:result , username : req.body.usernamemy,page_title:title, page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
            }
          });

});
app.post("/complex_search",function(req, res){
    var query = {};
    if( req.body.location != "") {
        query["town"] = req.body.location;

    }
    if( req.body.radiotype != null) {
        query["real_estate_type"] = req.body.radiotype;
        if(req.body.radiotype == 'Σπίτι' && req.body.search_building !='nobuilding'){

          if( req.body.search_building == 'monokatoikia'){
              query["building"] = 'Μονοκατοικία';
          }else if( req.body.search_building == 'studio'){
              query["building"] ='Στούντιο';
          }else if(req.body.search_building == 'department'){
              query["building"] = 'Διαμέρισμα';
          }
          var search_building = req.body.search_building;
          var search_type = 'home';
        }else{
            var search_building = 'nobuilding';
            if(req.body.radiotype == 'Γη'){
                var search_type = 'land';
            }else if(req.body.radiotype == 'Εργασία'){
                var search_type = 'work';
            }else if(req.body.radiotype == 'Σπίτι'){
                var search_type = 'home';
            }
                  var search_building = req.body.search_building;
        }
    }else{
      var search_building = req.body.search_building;
      var search_type = 'notype';
    }

    if( req.body.radiocase != null) {
        query["case"] = req.body.radiocase;
        if(req.body.radiocase == 'ενοικίαση'){
            var case_type = 'rent';
        }else if(req.body.radiocase == 'Πώληση'){
            var case_type = 'sale';
        }

    }else{
        var case_type = 'nocase';

    }

    if(req.body.from_price != "" && req.body.to_price != "") {
        var  subquery ={};
        subquery["$gt"] = req.body.from_price;
        subquery["$lt"] = req.body.to_price;
        query["price"] = subquery;
    }else if(req.body.from_price != "" && req.body.to_price == "") {
          var  subquery ={};
          subquery["$gt"] = req.body.from_price;
          query["price"] = subquery;
      }else if(req.body.from_price == "" && req.body.to_price != "") {
        var  subquery ={};
        subquery["$lt"] = req.body.to_price;
        query["price"] = subquery;
      }


    if(req.body.from_m != "" && req.body.to_m != "") {
        var  subquery ={};
        subquery["$gt"] = req.body.from_m;
        subquery["$lt"] = req.body.to_m;
        query["area"] = subquery;
    }else if(req.body.from_m != "" && req.body.to_m == "") {
        var  subquery ={};
        subquery["$gt"] = req.body.from_m;
        query["area"] = subquery;
    }else if(req.body.from_m == "" && req.body.to_m != "") {
        var  subquery ={};
        subquery["$lt"] = req.body.to_m;
        query["area"] = subquery;
    }

    console.log(query);
        Real_estate.find(  query, function (err, result) {
          if (err) {
              console.log(err);
          }else{
            console.log(result.length);

              console.log(case_type);
                console.log(search_type);
                  console.log(search_building);
              res.render('e-spiti',{data:result , username : req.body.username ,page_title:'RESULTS AFTER YOUR SEARCH', page_case:case_type, real_estate_type:search_type, building:search_building});
          }
        });

});

app.post("/add",function(req, res){

              res.render('add',{username : req.body.username, error : 'noerror'});


});
app.post("/addit",function(req, res){
  Real_estate.findOne( { title:  req.body.title }, function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      console.log("already exist");
      var errortitle =  req.body.title;
        res.render('add',{username : req.body.username, error : errortitle});
    }
    if (!result) {
          query ={};
          if( req.body.title != "" ){
            query["title"] =  req.body.title;
          }
          if( req.body.case != "" ){
            query["case"] =  req.body.case;
          }
          if( req.body.real_estate_type != "" ){
            query["real_estate_type"] =  req.body.real_estate_type;
          }
          if( req.body.town!= "" ){
            query["town"] =  req.body.town;
          }
          if( req.body.region != "" ){
            query["region"] = req.body.region;
          }
          if(req.body.address != "" ){
            query["address"] =  req.body.address;
          }
          if( req.body.area != "" ){
            query["area"] =  req.body.area;
          }

          if(req.body.price != "" ){
            query["price"] = req.body.price;
          }
          if( req.body.area != "" ){
            query["area"] =  req.body.area;
          }
          if( req.body.floor != "" ){
            query["floor"] = req.body.floor;
          }
          if( req.body.parking != "" ){
            query["parking"] =  req.body.parking;
          }
          if( req.body.heating_system != "" ){
            query["heating_system"] = req.body.heating_system;
          }
          if( req.body.details != "" ){
            query["details"] =  req.body.details;
          }

          if( req.body.year_of_construct != "" ){
            query["year_of_construct"] = req.body.year_of_construct;
          }

          if( req.body.iner_char != "" ){
              var iner = req.body.iner_char.split(',');
            query["iner_char"] =  iner;
          }
          if( req.body.outer_char != "" ){
              var outer = req.body.outer_char.split(',');
            query["outer_char"] =   outer;
          }
          if( req.body.extra_char != "" ){
                var extra = req.body.extra_char.split(',');

            query["extra_char"] =  extra;
          }
            query["agent"] =  req.body.username;
          console.log(query);
           Real_estate.insertMany([query]).then(function(){
             console.log("Data inserted")  // Success
           }).catch(function(error){
             console.log(error)      // Failure
           });

           Real_estate.find( {}, function (err, dataresult) {
             if (err) {
                 console.log(err);
             }else{
               console.log(dataresult.length);
                 res.render('e-spiti',{data:dataresult , username :  req.body.username,page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
             }           });
    }
  });



});

app.post("/delete",function(req, res){
  Real_estate.findByIdAndRemove({_id: req.body.id},  function(err,data){

    if (err) {
        console.log(err);
    }else{
        console.log("Deleted");
        Real_estate.find( {}, function (err, dataresult) {
          if (err) {
              console.log(err);
          }else{
            console.log(dataresult.length);
              res.render('e-spiti',{data:dataresult , username :  req.body.username,page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
          }
        });

    }
});



});

app.post("/update",function(req, res){
  Real_estate.findById(req.body.id, function (err, property) {


    if(err){
        console.log(err);
    }else{

        res.render('update',{update_data:property , username : req.body.username});
    }
  });


});
app.post("/updateit",function(req, res){

  query ={};
  if( req.body.title != "" ){
    query["title"] =  req.body.title;
  }
  if( req.body.case != "" ){
    query["case"] =  req.body.case;
  }
  if( req.body.real_estate_type != "" ){
    query["real_estate_type"] =  req.body.real_estate_type;
  }
  if( req.body.town!= "" ){
    query["town"] =  req.body.town;
  }
  if( req.body.region != "" ){
    query["region"] = req.body.region;
  }
  if(req.body.address != "" ){
    query["address"] =  req.body.address;
  }
  if( req.body.area != "" ){
    query["area"] =  req.body.area;
  }

  if(req.body.price != "" ){
    query["price"] = req.body.price;
  }
  if( req.body.area != "" ){
    query["area"] =  req.body.area;
  }
  if( req.body.floor != "" ){
    query["floor"] = req.body.floor;
  }
  if( req.body.parking != "" ){
    query["parking"] =  req.body.parking;
  }
  if( req.body.heating_system != "" ){
    query["heating_system"] = req.body.heating_system;
  }
  if( req.body.details != "" ){
    query["details"] =  req.body.details;
  }

  if( req.body.year_of_construct != "" ){
    query["year_of_construct"] = req.body.year_of_construct;
  }

  if( req.body.iner_char != "" ){
      var iner = req.body.iner_char.split(',');
    query["iner_char"] =  iner;
  }
  if( req.body.outer_char != "" ){
      var outer = req.body.outer_char.split(',');
    query["outer_char"] =   outer;
  }
  if( req.body.extra_char != "" ){
        var extra = req.body.extra_char.split(',');

    query["extra_char"] =  extra;
  }
    query["agent"] =  req.body.username;
  console.log(query);


 var MongoClient = require('mongodb').MongoClient;
 var url = "mongodb://127.0.0.1:27017/";

 MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
   if (err) throw err;
   var dbo = db.db("real_estate_db");
   var myquery = dbo.collection("real_estates").findOne({ _id:req.body.id });
   var newvalues = { $set: query };
   dbo.collection("real_estates").updateOne(myquery, newvalues, function(err, res) {
     if (err) throw err;
     console.log("1 document updated");


 });



});
Real_estate.find( {}, function (err1, dataresult) {
  if (err1) {
      console.log(err);
  }else{
    console.log(dataresult.length);
      res.render('e-spiti',{data:dataresult , username :  req.body.username,page_title:'ALL THE PROPERTIES', page_case:'nocase',real_estate_type:'notype',building:'nobuilding'});
  }
});
});
  console.log("Server started");
});
