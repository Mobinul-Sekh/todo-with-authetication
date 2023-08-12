const express = require('express')
const router = express.Router()
const { Item, List} = require('../models/todo')
const defaultItems = require('../models/default-todos')
const _ = require("lodash");
const authenticateToken = require('../middlewares/jwt-middleware')

router.get("/read-all", authenticateToken, function (req, res) {
    
    console.log(req.user);
    Item.find({ user: req.user.id }, async function (err, foundItems) {
        if (err) {
            console.log("Error while get todos for the user -> ", err);
        }
        else {
            if (foundItems.length === 0) {
                const insertItems = async () => {
                    for (const element of defaultItems) {
                      const newItem = new Item({
                        name: element,
                        user: req.user.id
                      });
                      await newItem.save();
                    }
                  };
                
                  insertItems().then(() => {
                    res.redirect("/read-all");
                  });
            }
            else {
                res.render("list", { listTitle: "Today", newItems: foundItems, userEmail: req.user.useremail });
            }
        }
    });
});

router.post("/add-todo", authenticateToken, function (req, res) {

    const itemName = req.body.item;
    const listName = req.body.listName;
    const userId = req.user.id;

    const newItem = new Item({
        name: itemName,
        user: userId
    });

    if( listName === "Today"){
        newItem.save();
        res.redirect("/read-all");
    }else{
        List.findOne({ name: listName, user: req.user.id }, function(err, foundList){
            if(err){
                console.log("Error while deleting list is -> " + err);
            }else{
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/new/" + listName);
            }
        });
    }
      
});

router.post("/delete-todo", authenticateToken, function (req, res){

    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItem, function(err){
                console.log("Deletion Successful!");
                res.redirect("/read-all");
        });
    }else{
        List.findOneAndUpdate({ name: listName, user: req.user.id }, {$pull: {items: {_id: checkedItem}}}, function( err, foundCustomList){
            if(err){
                console.log("Error while deleting custom list is -> " + err);
            }else{
                res.redirect("/new/" + listName);
            }
        });
    }
    
});

router.get("/new/:customListTitle", authenticateToken, function (req, res) {

    customListTitle = _.capitalize(req.params.customListTitle);

    List.findOne({ name: customListTitle, user: req.user.id }, function(err, foundList){
        if(err){
            console.log("The error is -> " + err);
        }else{
            if(!foundList){

                // Create a new list

                const customList = new List({
                    name: customListTitle,
                    user: req.user.id,
                    items: []
                });

                customList.save();
                res.redirect("/new/" + customListTitle);

            }else{

                // Show an existing list

                res.render("list", { listTitle: foundList.name, newItems: foundList.items , userEmail: req.user.useremail });
            }
        }
    });

});


module.exports = router;