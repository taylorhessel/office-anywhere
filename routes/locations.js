var admin;
var express = require('express');
var router = express.Router();
var queries = require('../db/queries')



router.get('/', getLocationsPage); // Retrieves selected location

function getLocationsPage(req, res, next) {
  queries.Comments().orderBy('id', 'asc')
        .then(function(data) {
          for(var i in data){
        if(req.isAuthenticated()){
          var userRole = req.user.role
          if (
           userRole != 'admin'|| userRole==undefined){
            data[i].admin = false;
          }else{
            data[i].admin = true;
          }
        }
        else{
          data[i].admin = false;
        }
      }
            res.render('locations', {
                title: 'Office Anywhere',
                brand: 'Office Anywhere',
                verify: req.isAuthenticated(),
                comments: data,
                admin : data.admin
            })
        })
    }


router.post('/locations', function(req, res, next) {
            queries.addComments(req.body.title,req.body.body)
                .then(function() {
                    queries.Comments()
                    .then(function(comments){
                      res.render('locations',{comments:comments, verify:req.isAuthenticated()})
                    })
                })
            })

module.exports = router;
