const mongoose = require('mongoose')

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model("Item", itemsSchema);


const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);

module.exports = { Item, List };