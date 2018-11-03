DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) not NULL,
  department_name VARCHAR(45),
  price FLOAT(10) NOT NULL,
  stock_quantity INT(10),
  PRIMARY KEY (item_id)
);
