const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 8;

const app = express();

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());


app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/eFC', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
}, {
    collection: 'User'
});

const adminModel = new mongoose.model('User', adminSchema, 'User');


app.get('/', function (req, res) {


    //find existing user//////////////////////////////////////////////////////////   
    adminModel.find(function (err, User) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(User);
        res.render('alpha', {
            "alpha": User
        });
    });

});



//handling user sign up//////////////////////////////////////////////
app.post('/addadmin', function (req, res) {

    var value = req.body.username;
    adminModel.findOne({
        'username': value
    }, function (err, docs) {
        if (docs) {

            console.log(docs);


            return;

        } else {
            let hash = bcrypt.hashSync('myPassword', saltRounds);

            let newAdmin = new adminModel({
                username: req.body.username,
                password: hash,
                role: 'admin'
            });

            newAdmin.save()
                .then(anythingfuck => {
                    // res.send("item saved to database");
                    res.redirect('/');
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }

    });



});

app.post('/deladmin', function (req, res) {

    var value = req.body.admindel;


    console.log(value);
    var promiseAsync = new Promise((resolve, reject) => {
        adminModel.deleteOne({
            'username': value
        }, function (req, err) {
            if (err) {
                console.log(err);
            }

        });
    });

    promiseAsync
        .then(res => {
            console.log('async: ', res);
            res.redirect('/');
        })
        .catch(err => console.log('error', err));



    res.redirect('/');
});


app.listen(9999, function () {
    console.log('server started.......');

});