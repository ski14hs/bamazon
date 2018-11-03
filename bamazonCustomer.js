var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayItems();
});

function displayItems(){
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function(err,res){
        if(err) return console.log(err);
        for(var i = 0; i < res.length; i++){
            console.log("ID: " + res[i].item_id + " Name: " + res[i].product_name + " Price: " + res[i].price);
        }
        //prompt user for ID and Units 
        orderItem();
    })
}

function orderItem(){
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What ID would you like to order?"
    },
    {
        name: "qty",
        type: "input",
        message: "How many units would you like to order?"
    }]).then(function(answer){
        var item_id = answer.id;
        var qty = parseInt(answer.qty);
        // console.log("QTY: " + qty);
        //query for item id and qty
        var query = "Select stock_quantity, price FROM products WHERE ?";
        connection.query(query, {item_id: item_id}, function(err,res){
            if(err) return console.log(err);

            // console.log("Current QTY: " + parseInt(res[0].stock_quantity) + res.stock_quantity);
            if(parseInt(res[0].stock_quantity) < qty){
                console.log("Bamazon has insufficient quantity for your order!");
                displayItems();
            }
            else{
                //order goes through, update quantity 
                var newQty = parseInt(res[0].stock_quantity) - qty;
                // console.log("New QTY: " + newQty);
                var totalPrice = res[0].price * qty;
                updateQty(item_id, newQty);
                console.log("Your total is: " + totalPrice);

            }
        })
    });
}

function updateQty(id, newQty){
    var query = "Update products SET ? WHERE ?";
    connection.query(query, [{stock_quantity: newQty}, {item_id: id}], function(err){
        if(err) return console.log(err);
        console.log("Order successfully placed");
        displayItems();
    })
}
