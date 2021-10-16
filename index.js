const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://mobinul_sekh:mongo7221db@cluster0.rzgrs.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Hey! welcome to todolist."
});

const item2 = new Item({
    name: "Hit the + button to add new tesk."
});

const item3 = new Item({
    name: "<-- check this box to delete tesks."
});

const defaultItems = [item1, item2, item3];


// Item.insertMany(defaultItems, function(err){
//     if(err){
//         console.log("err");
//     }else{
//         console.log("successfully inserted!"); 
//     }
// });

// Item.updateOne({_id: "61672c33ccde3bd2e11016dc"}, {name: "clean toilet"}, function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("successfully updated!");
//     }
// });



app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("default items successfully inserted!");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", { listTitle: "Today", newItems: foundItems });
        }
    });

});

app.post("/", function (req, res) {

    const itemName = req.body.item;
    const listName = req.body.listName;

    const newItem = new Item({
        name: itemName
    });

    if( listName === "Today"){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundList){
            if(err){
                console.log("Error while deleting list is -> " + err);
            }else{
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
      
});

app.post("/delete", function (req, res){

    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItem, function(err){
                console.log("Deletion Successful!");
                res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function( err, foundCustomList){
            if(err){
                console.log("Error while deleting custom list is -> " + err);
            }else{
                res.redirect("/" + listName);
            }
        });
    }
    
});

app.get("/:customListTitle", function (req, res) {

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
                res.redirect("/" + customListTitle);

            }else{

                // Show an existing list

                res.render("list", { listTitle: foundList.name, newItems: foundList.items });
            }
        }
    });
    
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(3500, function () {
    console.log("server is running on heroku..");
})