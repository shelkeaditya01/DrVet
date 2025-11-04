# DRVET - Veterinary Semen Selling Platform

A modern, user-friendly web application for managing a veterinary semen selling business. Built with React, Tailwind CSS, and Express.js.

## Features

- 📊 **Dashboard**: Overview of customers, orders, stock, and revenue
- 👥 **Customer Management**: Add, edit, delete, and search customers
- 📦 **Stock Management**: Track inventory with low stock alerts and expiry tracking
- 🛒 **Order Management**: Create orders, track status, and manage customer purchases
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Fully responsive design

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Icons**: Lucide React
- **Data Storage**: JSON files (can be easily migrated to a database)

## Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

   Or install all at once:
   ```bash
   npm run install-all
   ```

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React app on `http://localhost:3000`

### Separate Commands

Run backend only:
```bash
npm run server
```

Run frontend only:
```bash
npm run client
```

## Project Structure

```
drvet/
├── server/
│   ├── index.js          # Express server with API endpoints
│   └── data/             # JSON data storage (auto-created)
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js    # Main layout with sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Customers.js
│   │   │   ├── Orders.js
│   │   │   └── Stock.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css        # Tailwind CSS imports
│   ├── tailwind.config.js
│   └── postcss.config.js
└── package.json
```

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Stock
- `GET /api/stock` - Get all stock items
- `POST /api/stock` - Add new stock item
- `PUT /api/stock/:id` - Update stock item
- `DELETE /api/stock/:id` - Delete stock item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order (auto-updates stock)
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Default Data

The application comes with sample stock items:
- Premium Bull Semen - Holstein
- Premium Bull Semen - Jersey
- Buffalo Semen - Murrah

## Building for Production

```bash
cd client
npm run build
```

The built files will be in `client/build/`

## Notes

- Data is stored in JSON files in `server/data/` directory
- For production, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)
- The backend automatically creates the data directory and initializes sample stock data on first run

## Branding

- **Name**: DRVET
- **Slogan**: पशुसेवा हीच ईश्वरसेवा (Service to animals is service to God - Marathi)

## License

ISC
