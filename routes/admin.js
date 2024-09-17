
var express=require('express');
var router=express.Router();
var pool=require('./pool');

//make sessions-----------------------
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
date= new Date()


router.get('/adminlogin',function(req,res){
    res.render('adminlogin',{message:''})
})

router.get('/adminlogout',function(req,res){
    localStorage.clear()
    res.render('adminlogin',{message:''})
})


router.post('/chkadminlogin', function(req, res, next) {
    pool.query("select * from administrator where (emailid=? or mobilenumber=?) and password=?",[req.body.email, req.body.email, req.body.password],function(error,result){
      if(error)
      {
        console.log(error)
        res.render("adminlogin",{message:'Server Error...'})
      }
        else
        {
            if(result.length==1)
            {
                localStorage.setItem("ADMIN",JSON.stringify(result[0]))
                res.render('dashboard',{data:result[0]})
            }
            else
            {
                res.render('adminlogin',{message:'Invalid Username/Password...'})
            }
        }
    })
})

module.exports=router;