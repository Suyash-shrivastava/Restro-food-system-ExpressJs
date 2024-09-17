var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');

//make sessions-----------------------
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');



router.get('/foodregister', function (req, res) {

    var admin = JSON.parse(localStorage.getItem("ADMIN"))
    if (admin) {
        return res.render('foodregister', { message: '' })
    }
    else {
        return res.render('adminlogin', { message: '' })

    }
})

router.post('/foodsubmit', upload.single("fimg"), function (req, res) {
    pool.query("insert into food_details (foodname, type, quantity, description, price, offer, image)values(?,?,?,?,?,?,?)", [req.body.fname, req.body.ftype, req.body.fquantity, req.body.desc, req.body.fprice, req.body.foffer, req.file.originalname], function (error, result) {

        console.log("data", req.body)
        console.log("file", req.file)
        if (error) {

            console.log(error)
            res.render('foodregister', { 'message': 'Server Error' })

        }
        else {
            res.render('foodregister', { 'message': 'Submit Record Successfully' })
        }
    })
})




router.get('/displayfood', function (req, res) {

    var admin = JSON.parse(localStorage.getItem("ADMIN"))
    if (!admin) {
        res.render('adminlogin', { message: '' })
    }
    else {
        pool.query("select * from food_details", function (error, result) {
            if (error) {
                res.render('displayfood', { data: [], message: "Record Not Found" })
            }
            else {
                res.render('displayfood', { data: result, message: "Record Fetch Successfully" })
            }
        })
    }
})



//search by id through anchor link
router.get('/searchbyid', function (req, res) {
    pool.query("select * from food_details where foodid=?", [req.query.fid], function (error, result) {
        if (error) {
            res.render('foodupdate', { data: [], message: "Record Not Found" })
        }
        else {
            res.render('foodupdate', { data: result[0], message: "Record Fetch Successfully" })
        }
    })
})



//update/editand delete data 

router.post('/food_edit_delete', function (req, res) {
    if (req.body.btn == 'edit') {

        pool.query("update food_details set foodname=?, type=?, quantity=?, description=?, price=?, offer=? where foodid=?", [req.body.fname, req.body.ftype, req.body.fquantity, req.body.desc, req.body.fprice, req.body.foffer, req.body.foodid], function (error, result) {
            if (error) {
                res.redirect('displayfood')
            }
            else {
                res.redirect('displayfood')

            }
        })
    }
    else {
        pool.query("delete from food_details where foodid=?", [req.body.foodid], function (error, result) {
            if (error) {
                res.redirect('displayfood')
            }
            else {
                res.redirect('displayfood')

            }
        })
    }
})

//------------------------------------------------------------------------------------------------------------

//for image updation

router.get('/searchbyidforimage', function (req, res) {
    pool.query("select * from food_details where foodid=?", [req.query.fid], function (error, result) {
        if (error) {
            res.render('showimage', { message: "server error" })
        }
        else {
            res.render('showimage', { data: result[0], message: "success" })
        }

    })
})



//edit image

router.post('/editimage', upload.single("fimg"), function (req, res) {
    pool.query("update food_details set image=? where foodid=?", [req.file.originalname, req.body.foodid], function (error, result) {
        if (error) {
            res.redirect('displayfood')
        }
        else {
            res.redirect('displayfood')
        }
    })

})



module.exports = router