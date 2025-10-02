# Online Pharmacy (Full-Stack Application)

A full-stack pharmacy management system developed as a university project.  
The app allows customers to browse products by category, manage a shopping cart, and complete checkout.  
The backend provides APIs for managing products, categories, and orders, with data stored in a **PostgreSQL** database.

## Features
- Browse categories and products
- Add/remove items to cart with instant updates
- Checkout with customer details and order confirmation
- CRUD operations for products and categories (admin, via database)
- RESTful API endpoints for client–server communication
- PostgreSQL database integration with relational schema (products, orders, order_items)

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL
- **Other Tools:** Git/GitHub, npm

## Project Structure
```
online-pharmacy-fullstack/
├── store-client/    # React.js frontend (has its own README)
├── store-server/    # Express.js backend (has its own README)
└── README.md        # This overview file
```

## Setup
Each component (client and server) has its own setup instructions:  
- [Frontend (store-client)](./store-client/README.md)  
- [Backend (store-server)](./store-server/README.md)  

## Database
The system uses **PostgreSQL** with three main tables:  
- **products** – medicines, personal care, vitamins & supplements  
- **orders** – customer orders with details (name, phone, address, payment method)  
- **order_items** – links products with orders, tracks quantity and line totals  

An SQL dump of the schema and sample data is included (`pharmacydb.sql`).  

## License
No license
