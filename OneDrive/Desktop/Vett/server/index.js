const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DATA_DIR = path.join(__dirname, 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

async function initializeData() {
  await ensureDataDir();
  
  const files = {
    customers: [],
    orders: [],
    stock: [
      {
        id: uuidv4(),
        productName: "Premium Bull Semen - Holstein",
        category: "Cattle",
        quantity: 50,
        price: 2500,
        unit: "straw",
        description: "High quality Holstein bull semen",
        batchNumber: "BS-2024-001",
        expiryDate: "2025-12-31"
      },
      {
        id: uuidv4(),
        productName: "Premium Bull Semen - Jersey",
        category: "Cattle",
        quantity: 30,
        price: 2200,
        unit: "straw",
        description: "High quality Jersey bull semen",
        batchNumber: "BS-2024-002",
        expiryDate: "2025-11-30"
      },
      {
        id: uuidv4(),
        productName: "Buffalo Semen - Murrah",
        category: "Buffalo",
        quantity: 40,
        price: 1800,
        unit: "straw",
        description: "Premium Murrah buffalo semen",
        batchNumber: "BS-2024-003",
        expiryDate: "2025-10-31"
      }
    ]
  };

  for (const [key, defaultValue] of Object.entries(files)) {
    const filePath = path.join(DATA_DIR, `${key}.json`);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
    }
  }
}

async function readData(fileName) {
  try {
    const filePath = path.join(DATA_DIR, `${fileName}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(fileName, data) {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// CUSTOMERS API
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await readData('customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customers = await readData('customers');
    const newCustomer = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    await writeData('customers', customers);
    res.json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customers = await readData('customers');
    const index = customers.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    customers[index] = { ...customers[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeData('customers', customers);
    res.json(customers[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customers = await readData('customers');
    const filtered = customers.filter(c => c.id !== req.params.id);
    await writeData('customers', filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STOCK API
app.get('/api/stock', async (req, res) => {
  try {
    const stock = await readData('stock');
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stock', async (req, res) => {
  try {
    const stock = await readData('stock');
    const newItem = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    stock.push(newItem);
    await writeData('stock', stock);
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/stock/:id', async (req, res) => {
  try {
    const stock = await readData('stock');
    const index = stock.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    stock[index] = { ...stock[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeData('stock', stock);
    res.json(stock[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/stock/:id', async (req, res) => {
  try {
    const stock = await readData('stock');
    const filtered = stock.filter(s => s.id !== req.params.id);
    await writeData('stock', filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ORDERS API
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readData('orders');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orders = await readData('orders');
    const stock = await readData('stock');
    
    const orderItems = req.body.items || [];
    for (const item of orderItems) {
      const stockItem = stock.find(s => s.id === item.stockId);
      if (!stockItem) {
        return res.status(400).json({ error: `Stock item ${item.stockId} not found` });
      }
      if (stockItem.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${stockItem.productName}` });
      }
      stockItem.quantity -= item.quantity;
    }
    
    await writeData('stock', stock);
    
    const newOrder = {
      id: uuidv4(),
      orderNumber: `ORD-${Date.now()}`,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await writeData('orders', orders);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readData('orders');
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    orders[index] = { ...orders[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeData('orders', orders);
    res.json(orders[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readData('orders');
    const filtered = orders.filter(o => o.id !== req.params.id);
    await writeData('orders', filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DASHBOARD STATS API
app.get('/api/dashboard', async (req, res) => {
  try {
    const customers = await readData('customers');
    const orders = await readData('orders');
    const stock = await readData('stock');
    
    const stats = {
      totalCustomers: customers.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalStockItems: stock.length,
      lowStockItems: stock.filter(s => s.quantity < 10).length,
      totalRevenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      recentOrders: orders.slice(-5).reverse()
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  await initializeData();
  app.listen(PORT, () => {
    console.log(`DRVET Server running on http://localhost:${PORT}`);
  });
}

startServer();

