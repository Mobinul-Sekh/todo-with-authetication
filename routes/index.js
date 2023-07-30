const express = require('express')
const router = express.Router()
const { Item, List} = require('../models/todo')
const defaultItems = require('../models/default-todos')
const _ = require("lodash");
const authenticateToken = require('../middlewares/jwt-middleware')

router.get("/read-all", authenticateToken, function (req, res) {
    
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("default items successfully inserted!");
                }
            });
            res.redirect("/read-all");
        }
        else {
            res.render("list", { listTitle: "Today", newItems: foundItems});
        }
    });

});

router.post("/add-todo", authenticateToken, function (req, res) {

    const itemName = req.body.item;
    const listName = req.body.listName;

    const newItem = new Item({
        name: itemName
    });

    if( listName === "Today"){
        newItem.save();
        res.redirect("/read-all");
    }else{
        List.findOne({name: listName}, function(err, foundList){
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
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function( err, foundCustomList){
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

    List.findOne({name: customListTitle}, function(err, foundList){
        if(err){
            console.log("The error is -> " + err);
        }else{
            if(!foundList){

                // Create a new list

                const customList = new List({
                    name: customListTitle,
                    items: []
                });

                customList.save();
                res.redirect("/new/" + customListTitle);

            }else{

                // Show an existing list

                res.render("list", { listTitle: foundList.name, newItems: foundList.items });
            }
        }
    });

});


module.exports = router;