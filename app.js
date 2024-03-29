//// Importing the Express.js framework
const express = require("express");

// Importing the mysql2 package to interact with MySQL database
const mysql = require("mysql2");

// Creating an instance of the Express application
const app = express();

// Importing the CORS middleware to enable cross-origin requests
const cors = require("cors");

// Enabling CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to extract info from the html
app.use(express.urlencoded({ extended: true }));

// Middleware to have access to the frontend
app.use(cors());
app.use(express.json());

// User account info and database configuration
const mysqlConnection = mysql.createConnection({
  user: "myDBuser",
  password: "M_gLC6AMou2SwRB4",
  host: "127.0.0.1",
  database: "myDB",
});

// Connect to MySQL
mysqlConnection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database:", err);
    throw err; // Stop execution if unable to connect
  }
  console.log("Connected to MySQL database...");
});

// Route: / => Homepage route
app.get("/", (req, res) => res.send("Up and running..."));

// Route: /create-tables => To create the necessary tables
app.get("/create-produc-table", (req, res) => {
  // Create Products table
  const createProductsTable = `CREATE TABLE IF NOT EXISTS Products (
      product_id INT AUTO_INCREMENT PRIMARY KEY,
      product_url VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL
  )`;

  // Create Description table
  const createDescriptionTable = `CREATE TABLE IF NOT EXISTS Description (
    description_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_brief_description TEXT NOT NULL,
    product_description TEXT NOT NULL,
    product_img VARCHAR(255) NOT NULL,
    product_link VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;

  // Create Price table
  const createPriceTable = `CREATE TABLE IF NOT EXISTS Price (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    starting_price VARCHAR(255) NOT NULL,
    price_range VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;

  // Create Users table
  const createUsersTable = `CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`;

  // Create Orders table
  const createOrdersTable = `CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
  )`;

  // Execute table creation queries
  mysqlConnection.query(createProductsTable, (err) => {
    if (err) throw err;
    console.log("Products table created successfully");
  });

  mysqlConnection.query(createDescriptionTable, (err) => {
    if (err) throw err;
    console.log("Description table created successfully");
  });

  mysqlConnection.query(createPriceTable, (err) => {
    if (err) throw err;
    console.log("Price table created successfully");
  });

  mysqlConnection.query(createUsersTable, (err) => {
    if (err) throw err;
    console.log("Users table created successfully");
  });

  mysqlConnection.query(createOrdersTable, (err) => {
    if (err) throw err;
    console.log("Orders table created successfully");
  });

  // Send response
  res.send("Tables created successfully");
});

// Route: /insert-product-info =>
// To insert a single data into the databas table
app.post("/insert-product-info", (req, res) => {
  const {
    iphoneId,
    imgPath,
    iphoneLink,
    iphoneTitle,
    startPrice,
    priceRange,
    briefDescription,
    fullDescription,
    username,
    password,
  } = req.body;

  // Insert data into the database
  const insertProductQuery = `INSERT INTO Products (product_url, product_name) VALUES (?, ?)`;
  mysqlConnection.query(
    insertProductQuery,
    [imgPath, iphoneTitle],
    (err, productResult) => {
      if (err) {
        console.log(`Error inserting product: ${err}`);
        res.status(500).json({ error: "Error inserting product" });
        return;
      }

      const productId = productResult.insertId;

      const insertDescriptionQuery = `INSERT INTO Description (product_id, product_brief_description, product_description, product_img, product_link) VALUES (?, ?, ?, ?, ?)`;
      mysqlConnection.query(
        insertDescriptionQuery,
        [productId, briefDescription, fullDescription, imgPath, iphoneLink],
        (err, descriptionResult) => {
          if (err) {
            console.log(`Error inserting description: ${err}`);
            res.status(500).json({ error: "Error inserting description" });
            return;
          }

          const insertPriceQuery = `INSERT INTO Price (product_id, starting_price, price_range) VALUES (?, ?, ?)`;
          mysqlConnection.query(
            insertPriceQuery,
            [productId, startPrice, priceRange],
            (err, priceResult) => {
              if (err) {
                console.log(`Error inserting price: ${err}`);
                res.status(500).json({ error: "Error inserting price" });
                return;
              }

              const insertUserQuery = `INSERT INTO Users (username, password) VALUES (?, ?)`;
              mysqlConnection.query(
                insertUserQuery,
                [username, password],
                (err, userResult) => {
                  if (err) {
                    console.log(`Error inserting user: ${err}`);
                    res.status(500).json({ error: "Error inserting user" });
                    return;
                  }

                  const userId = userResult.insertId;

                  const insertOrderQuery = `INSERT INTO Orders (product_id, user_id) VALUES (?, ?)`;
                  mysqlConnection.query(
                    insertOrderQuery,
                    [productId, userId],
                    (err, orderResult) => {
                      if (err) {
                        console.log(`Error inserting order: ${err}`);
                        res
                          .status(500)
                          .json({ error: "Error inserting order" });
                        return;
                      }

                      res
                        .status(200)
                        .json({ message: "Data inserted successfully" });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

//method two

// Define the route handler for inserting product information
app.post("/insert-product-info", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      iphoneId,
      imgPath,
      iphoneLink,
      iphoneTitle,
      startPrice,
      priceRange,
      briefDescription,
      fullDescription,
      username,
      password,
    } = req.body;

    // Insert product information and get the product ID
    const productId = await insertProduct(imgPath, iphoneTitle);

    // Insert product description using the obtained product ID
    await insertDescription(
      productId,
      briefDescription,
      fullDescription,
      imgPath,
      iphoneLink
    );

    // Insert product price using the obtained product ID
    await insertPrice(productId, startPrice, priceRange);

    // Insert user information and get the user ID
    const userId = await insertUser(username, password);

    // Insert order using the obtained product and user IDs
    await insertOrder(productId, userId);

    // Send success response if all insertions are successful
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    // Handle any errors that occur during the insertion process
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

// Function to insert product information into the database
async function insertProduct(imgPath, iphoneTitle) {
  // Define the SQL query to insert product information
  const insertProductQuery = `INSERT INTO Products (product_url, product_name) VALUES (?, ?)`;

  // Execute the query and retrieve the insert result
  const [productResult] = await mysqlConnection
    .promise()
    .query(insertProductQuery, [imgPath, iphoneTitle]);

  // Return the inserted product ID
  return productResult.insertId;
}

// Function to insert product description into the database
async function insertDescription(
  productId,
  briefDescription,
  fullDescription,
  imgPath,
  iphoneLink
) {
  // Define the SQL query to insert product description
  const insertDescriptionQuery = `INSERT INTO Description (product_id, product_brief_description, product_description, product_img, product_link) VALUES (?, ?, ?, ?, ?)`;

  // Execute the query to insert product description
  await mysqlConnection
    .promise()
    .query(insertDescriptionQuery, [
      productId,
      briefDescription,
      fullDescription,
      imgPath,
      iphoneLink,
    ]);
}

// Function to insert product price into the database
async function insertPrice(productId, startPrice, priceRange) {
  // Define the SQL query to insert product price
  const insertPriceQuery = `INSERT INTO Price (product_id, starting_price, price_range) VALUES (?, ?, ?)`;

  // Execute the query to insert product price
  await mysqlConnection
    .promise()
    .query(insertPriceQuery, [productId, startPrice, priceRange]);
}

// Function to insert user information into the database
async function insertUser(username, password) {
  // Define the SQL query to insert user information
  const insertUserQuery = `INSERT INTO Users (username, password) VALUES (?, ?)`;

  // Execute the query and retrieve the insert result
  const [userResult] = await mysqlConnection
    .promise()
    .query(insertUserQuery, [username, password]);

  // Return the inserted user ID
  return userResult.insertId;
}

// Function to insert order information into the database
async function insertOrder(productId, userId) {
  // Define the SQL query to insert order information
  const insertOrderQuery = `INSERT INTO Orders (product_id, user_id) VALUES (?, ?)`;

  // Execute the query to insert order information
  await mysqlConnection.promise().query(insertOrderQuery, [productId, userId]);
}
/*
// use  this for postman json data
{
  "iphoneId": "56789",
  "imgPath": "https://example.com/galaxy20_image.jpg",
  "iphoneLink": "https://example.com/galaxy20_page",
  "iphoneTitle": "Galaxy 20",
  "startPrice": "1299",
  "priceRange": "High-end",
  "briefDescription": "The latest Galaxy 20 with stunning features",
  "fullDescription": "Experience the power and innovation of the Galaxy 20 with its sleek design and advanced capabilities.",
  "username": "abebe",
  "password": "abebe123"
}

*/

// for multiple products
// To insert multiple products into the database table, you can modify the route handler to accept an array of product data in the request body. Here's how you can achieve it:

// Define the route handler for inserting multiple product information

app.post("/insert-multiple-products-info", async (req, res) => {
  try {
    // Extract data from the request body
    const products = req.body;

    // Array to store promises for each product insertion
    const insertPromises = [];

    // Iterate over each product and insert its information into the database
    for (const product of products) {
      const {
        imgPath,
        iphoneTitle,
        startPrice,
        priceRange,
        briefDescription,
        fullDescription,
        username,
        password,
        iphoneLink, // Add iphoneLink here
      } = product;

      // Insert product information and get the product ID
      const productId = await insertProduct(imgPath, iphoneTitle);

      // Insert product description using the obtained product ID
      const insertDescriptionPromise = insertDescription(
        productId,
        briefDescription,
        fullDescription,
        imgPath,
        iphoneLink // Use iphoneLink here
      );

      // Insert product price using the obtained product ID
      const insertPricePromise = insertPrice(productId, startPrice, priceRange);

      // Insert user information and get the user ID
      const userId = await insertUser(username, password);

      // Insert order using the obtained product and user IDs
      const insertOrderPromise = insertOrder(productId, userId);

      // Add promises to the array
      insertPromises.push(
        insertDescriptionPromise,
        insertPricePromise,
        insertOrderPromise
      );
    }

    // Wait for all insertions to complete
    await Promise.all(insertPromises);

    // Send success response if all insertions are successful
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    // Handle any errors that occur during the insertion process
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

//sample data for multiple products
/*
[
  {
    "imgPath": "iphone20_image1.jpg",
    "iphoneTitle": "iPhone 20 Model A",
    "startPrice": 999,
    "priceRange": "High",
    "briefDescription": "Brief description of iPhone 20 Model A",
    "fullDescription": "Full description of iPhone 20 Model A",
    "username": "john_doe",
    "password": "password123",
    "iphoneLink": "https://example.com/iphone20_modelA"
  },
  {
    "imgPath": "iphone20_image2.jpg",
    "iphoneTitle": "iPhone 20 Model B",
    "startPrice": 899,
    "priceRange": "Medium",
    "briefDescription": "Brief description of iPhone 20 Model B",
    "fullDescription": "Full description of iPhone 20 Model B",
    "username": "jane_doe",
    "password": "password456",
    "iphoneLink": "https://example.com/iphone20_modelB"
  },
  {
    "imgPath": "iphone20_image3.jpg",
    "iphoneTitle": "iPhone 20 Model C",
    "startPrice": 799,
    "priceRange": "Low",
    "briefDescription": "Brief description of iPhone 20 Model C",
    "fullDescription": "Full description of iPhone 20 Model C",
    "username": "bob_smith",
    "password": "password789",
    "iphoneLink": "https://example.com/iphone20_modelC"
  },
  {
    "imgPath": "iphone20_image4.jpg",
    "iphoneTitle": "iPhone 20 Model D",
    "startPrice": 1099,
    "priceRange": "High",
    "briefDescription": "Brief description of iPhone 20 Model D",
    "fullDescription": "Full description of iPhone 20 Model D",
    "username": "emily_jones",
    "password": "passwordABC",
    "iphoneLink": "https://example.com/iphone20_modelD"
  },
  {
    "imgPath": "iphone20_image5.jpg",
    "iphoneTitle": "iPhone 20 Model E",
    "startPrice": 999,
    "priceRange": "High",
    "briefDescription": "Brief description of iPhone 20 Model E",
    "fullDescription": "Full description of iPhone 20 Model E",
    "username": "michael_smith",
    "password": "passwordXYZ",
    "iphoneLink": "https://example.com/iphone20_modelE"
  }
]
 */

// Start server
app.listen(3005, () => {
  console.log(`Server is running on port 3005...`);
});
