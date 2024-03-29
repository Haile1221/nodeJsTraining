

Node.js Express.js MySQL API
This repository contains code for a RESTful API built with Express.js to interact with a MySQL database. It provides endpoints to create necessary tables, insert single or multiple product information into the database, and retrieve data.

Technologies Used
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
Express.js: A web application framework for Node.js used to build the API endpoints.
MySQL: A popular open-source relational database management system used for data storage and retrieval.
mysql2: A MySQL client for Node.js used to interact with the MySQL database.
CORS (Cross-Origin Resource Sharing): Middleware used to enable cross-origin requests.CORS is used to enable cross-origin requests, allowing your Express.js server to accept requests from domains other than its own. This is commonly used in web development to allow frontend applications to communicate with backend APIs hosted on different domains.


Installation
Clone the repository:


git clone <repository_url>
Install dependencies:

npm install
Configure MySQL connection:

Update the MySQL connection settings in the code to match your database configuration.
Ensure that MySQL server is running and accessible.
API Endpoints
GET /create-produc-table: Endpoint to create necessary tables in the database.

POST /insert-product-info: Endpoint to insert a single product information into the database.

POST /insert-multiple-products-info: Endpoint to insert multiple product information into the database.

Usage
Start the server:

Use tools like Postman to send requests to the API endpoints.

For inserting a single product, send a POST request to /insert-product-info with product information in the request body.
For inserting multiple products, send a POST request to /insert-multiple-products-info with an array of product information in the request body.


npm start
Use tools like Postman to send requests to the API endpoints.

For inserting a single product, send a POST request to /insert-product-info with product information in the request body.
For inserting multiple products, send a POST request to /insert-multiple-products-info with an array of product information in the request body.
Sample Data Format

Note
Ensure proper configuration of MySQL database connection before using the API.
Always handle errors gracefully and validate input data to prevent security vulnerabilities.

Author
[Haile]

License
This project is licensed under the MIT License.
