// API Service Bridge for InventoryFlow
// Includes a premium, high-fidelity LocalStorage Database Simulator fallback
// which automatically takes over if the backend API server is offline!

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
let useLocalMock = false;

// Initialize high-fidelity Local Storage database if offline fallback is triggered
function initMockDb() {
  if (!localStorage.getItem('if_db_seeded')) {
    console.log("[api] Seeding LocalStorage high-fidelity database mock records...");
    
    // Seed Products
    const products = [
      {
        id: "p1",
        name: "MacBook Pro M3 Max",
        sku: "ELEC-MBP-M3MX",
        description: "16-inch MacBook Pro with M3 Max chip, 36GB RAM, 1TB SSD. Space Black.",
        category: "Electronics",
        price: 249999.00,
        stock_quantity: 12,
        image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 5*24*60*60*1000).toISOString()
      },
      {
        id: "p2",
        name: "iPhone 15 Pro Max",
        sku: "ELEC-IPH-15PM",
        description: "Titanium design, A17 Pro chip, 48MP Camera, 256GB Storage.",
        category: "Electronics",
        price: 139900.00,
        stock_quantity: 42,
        image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 4*24*60*60*1000).toISOString()
      },
      {
        id: "p3",
        name: "Sony WH-1000XM5 Headphones",
        sku: "ELEC-SNY-XM5",
        description: "Industry leading wireless noise cancelling headphones, Silver.",
        category: "Electronics",
        price: 29900.00,
        stock_quantity: 8,
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 4*24*60*60*1000).toISOString()
      },
      {
        id: "p4",
        name: "Ergonomic Standing Desk",
        sku: "OFF-DSK-STND",
        description: "Dual-motor motorized standing desk with dark oak wood finish tabletop.",
        category: "Office Supplies",
        price: 32500.00,
        stock_quantity: 18,
        image_url: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 3*24*60*60*1000).toISOString()
      },
      {
        id: "p5",
        name: "Premium Office Task Chair",
        sku: "OFF-CHR-TASK",
        description: "Breathable mesh back support, 3D armrests, and dynamic lumbar alignment.",
        category: "Office Supplies",
        price: 18900.00,
        stock_quantity: 25,
        image_url: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 3*24*60*60*1000).toISOString()
      },
      {
        id: "p6",
        name: "Espresso Barista Machine",
        sku: "KSH-COF-BRST",
        description: "15-bar pump espresso maker with integrated milk frother steam wand.",
        category: "Kitchen Appliances",
        price: 21500.00,
        stock_quantity: 0,
        image_url: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 2*24*60*60*1000).toISOString()
      },
      {
        id: "p7",
        name: "Ultra-Bullet Blender",
        sku: "KSH-BLN-ULTR",
        description: "1200W high-speed blending system for nutrient extraction smoothies.",
        category: "Kitchen Appliances",
        price: 5900.00,
        stock_quantity: 65,
        image_url: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 2*24*60*60*1000).toISOString()
      },
      {
        id: "p8",
        name: "Apple Watch Series 9 GPS",
        sku: "WEAR-APW-S9",
        description: "45mm Midnight Aluminum Case with Sport Band. ECG and Oxygen tracking.",
        category: "Wearables",
        price: 44900.00,
        stock_quantity: 30,
        image_url: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 1*24*60*60*1000).toISOString()
      },
      {
        id: "p9",
        name: "Fitbit Charge 6 Tracker",
        sku: "WEAR-FIT-CHG6",
        description: "Advanced health & fitness tracker with built-in GPS and heart rate alerts.",
        category: "Wearables",
        price: 14900.00,
        stock_quantity: 5,
        image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        updated_at: new Date(Date.now() - 1*24*60*60*1000).toISOString()
      },
      {
        id: "p10",
        name: "Fountain Executive Pen",
        sku: "OFF-PEN-EXEC",
        description: "Gold plated iridium nib fountain pen with mahogany luxury gift box.",
        category: "Office Supplies",
        price: 2400.00,
        stock_quantity: 110,
        image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=300",
        created_at: new Date(Date.now()).toISOString(),
        updated_at: new Date(Date.now()).toISOString()
      }
    ];

    // Seed Customers
    const customers = [
      { id: "c1", full_name: "Rajesh Kumar", email: "rajesh.kumar@example.com", phone_number: "+91 98765 43210", address: "Block 4C, Green Glen Layout, Bangalore, Karnataka", created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
      { id: "c2", full_name: "Priya Sharma", email: "priya.sharma@example.com", phone_number: "+91 98123 45678", address: "Flat 202, Regency Heights, Andheri West, Mumbai, Maharashtra", created_at: new Date(Date.now() - 6*24*60*60*1000).toISOString() },
      { id: "c3", full_name: "Amit Patel", email: "amit.patel@example.com", phone_number: "+91 91234 56789", address: "22, Navrangpura Road, Ahmedabad, Gujarat", created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
      { id: "c4", full_name: "Sneha Reddy", email: "sneha.reddy@example.com", phone_number: "+91 88888 77777", address: "H.No 12-4-89, Jubilee Hills, Hyderabad, Telangana", created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
      { id: "c5", full_name: "Vikram Singh", email: "vikram.singh@example.com", phone_number: "+91 77665 54433", address: "C-14, Malviya Nagar, Jaipur, Rajasthan", created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
      { id: "c6", full_name: "Ananya Sen", email: "ananya.sen@example.com", phone_number: "+91 94432 10987", address: "Salt Lake Sector II, Kolkata, West Bengal", created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
      { id: "c7", full_name: "Karan Malhotra", email: "karan.malhotra@example.com", phone_number: "+91 90123 98765", address: "Sector 15, Gurgaon, Haryana", created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
      { id: "c8", full_name: "Nisha Verma", email: "nisha.verma@example.com", phone_number: "+91 89012 34567", address: "Preet Vihar, New Delhi, Delhi", created_at: new Date(Date.now()).toISOString() }
    ];

    // Seed Orders
    const orders = [
      {
        id: "o1",
        customer_id: "c1",
        customer_name: "Rajesh Kumar",
        total_amount: 279899.00,
        status: "Completed",
        created_at: new Date(Date.now() - 6*24*60*60*1000).toISOString(),
        items: [
          { id: "oi1", product_id: "p1", product_name: "MacBook Pro M3 Max", product_sku: "ELEC-MBP-M3MX", quantity: 1, unit_price: 249999.00, subtotal: 249999.00 },
          { id: "oi2", product_id: "p3", product_name: "Sony WH-1000XM5 Headphones", product_sku: "ELEC-SNY-XM5", quantity: 1, unit_price: 29900.00, subtotal: 29900.00 }
        ]
      },
      {
        id: "o2",
        customer_id: "c2",
        customer_name: "Priya Sharma",
        total_amount: 145800.00,
        status: "Processing",
        created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
        items: [
          { id: "oi3", product_id: "p2", product_name: "iPhone 15 Pro Max", product_sku: "ELEC-IPH-15PM", quantity: 1, unit_price: 139900.00, subtotal: 139900.00 },
          { id: "oi4", product_id: "p7", product_name: "Ultra-Bullet Blender", product_sku: "KSH-BLN-ULTR", quantity: 1, unit_price: 5900.00, subtotal: 5900.00 }
        ]
      },
      {
        id: "o3",
        customer_id: "c3",
        customer_name: "Amit Patel",
        total_amount: 32500.00,
        status: "Pending",
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        items: [
          { id: "oi5", product_id: "p4", product_name: "Ergonomic Standing Desk", product_sku: "OFF-DSK-STND", quantity: 1, unit_price: 32500.00, subtotal: 32500.00 }
        ]
      },
      {
        id: "o4",
        customer_id: "c4",
        customer_name: "Sneha Reddy",
        total_amount: 44900.00,
        status: "Completed",
        created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        items: [
          { id: "oi6", product_id: "p8", product_name: "Apple Watch Series 9 GPS", product_sku: "WEAR-APW-S9", quantity: 1, unit_price: 44900.00, subtotal: 44900.00 }
        ]
      },
      {
        id: "o5",
        customer_id: "c5",
        customer_name: "Vikram Singh",
        total_amount: 18900.00,
        status: "Cancelled",
        created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        items: [
          { id: "oi7", product_id: "p5", product_name: "Premium Office Task Chair", product_sku: "OFF-CHR-TASK", quantity: 1, unit_price: 18900.00, subtotal: 18900.00 }
        ]
      }
    ];

    localStorage.setItem('if_products', JSON.stringify(products));
    localStorage.setItem('if_customers', JSON.stringify(customers));
    localStorage.setItem('if_orders', JSON.stringify(orders));
    localStorage.setItem('if_db_seeded', 'true');
  }
}

/**
 * Custom local database mock router wrapper
 */
const mockApi = {
  getDashboard() {
    initMockDb();
    const products = JSON.parse(localStorage.getItem('if_products') || '[]');
    const customers = JSON.parse(localStorage.getItem('if_customers') || '[]');
    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');

    const total_products = products.length;
    const total_customers = customers.length;
    const total_orders = orders.length;

    const total_revenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    const low_stock_count = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 20).length;
    const out_of_stock = products.filter(p => p.stock_quantity === 0).length;
    const in_stock = products.filter(p => p.stock_quantity > 20).length;

    // Compile stock alerts
    const stock_alerts = products
      .filter(p => p.stock_quantity <= 20)
      .sort((a,b) => a.stock_quantity - b.stock_quantity)
      .slice(0, 10);

    // Compile Top Products (simulated based on seeded orders)
    const productSoldMap = {};
    orders.forEach(o => {
      if (o.status !== 'Cancelled') {
        o.items.forEach(item => {
          if (!productSoldMap[item.product_id]) {
            productSoldMap[item.product_id] = { name: item.product_name, sku: item.product_sku, total_sold: 0, revenue: 0 };
          }
          productSoldMap[item.product_id].total_sold += item.quantity;
          productSoldMap[item.product_id].revenue += parseFloat(item.subtotal);
        });
      }
    });

    const top_products = Object.values(productSoldMap)
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 5);

    // 7 Days Trend Series
    const orders_trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i*24*60*60*1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayStart = new Date(date.setHours(0,0,0,0)).getTime();
      const dayEnd = new Date(date.setHours(23,59,59,999)).getTime();

      const dailyOrders = orders.filter(o => {
        const ts = new Date(o.created_at).getTime();
        return ts >= dayStart && ts <= dayEnd;
      });

      const count = dailyOrders.length;
      const revenue = dailyOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

      orders_trend.append ? orders_trend.append({ date: dateStr, orders: count, revenue }) : orders_trend.push({ date: dateStr, orders: count, revenue });
    }

    return {
      success: true,
      widgets: {
        total_products,
        total_customers,
        total_orders,
        total_revenue,
        low_stock_count
      },
      charts: {
        distribution: { in_stock, low_stock: low_stock_count, out_of_stock },
        top_products,
        orders_trend
      },
      stock_alerts
    };
  },

  getProducts({ search, category, stock_status, sort_by, sort_order, page, limit }) {
    initMockDb();
    let list = JSON.parse(localStorage.getItem('if_products') || '[]');

    if (search) {
      const filter = search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(filter) || 
        p.sku.toLowerCase().includes(filter) ||
        p.category.toLowerCase().includes(filter)
      );
    }

    if (category) {
      list = list.filter(p => p.category === category);
    }

    if (stock_status) {
      if (stock_status === 'out_of_stock') list = list.filter(p => p.stock_quantity === 0);
      if (stock_status === 'low_stock') list = list.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 20);
      if (stock_status === 'in_stock') list = list.filter(p => p.stock_quantity > 20);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sort_by];
      let valB = b[sort_by];
      
      if (typeof valA === 'string') {
        return sort_order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sort_order === 'asc' ? (valA - valB) : (valB - valA);
    });

    const total = list.length;
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      success: true,
      total,
      page,
      limit,
      data: paginated
    };
  },

  createProduct(productData) {
    initMockDb();
    const list = JSON.parse(localStorage.getItem('if_products') || '[]');
    
    if (list.some(p => p.sku === productData.sku)) {
      const err = new Error("SKU already exists");
      err.code = "DUPLICATE_SKU";
      throw err;
    }

    const newProd = {
      id: "p_" + Math.random().toString(36).substring(2, 9),
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    list.unshift(newProd);
    localStorage.setItem('if_products', JSON.stringify(list));
    return newProd;
  },

  updateProduct(id, productData) {
    initMockDb();
    const list = JSON.parse(localStorage.getItem('if_products') || '[]');
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Product not found");

    if (productData.sku && productData.sku !== list[idx].sku) {
      if (list.some(p => p.sku === productData.sku)) {
        const err = new Error("SKU already exists");
        err.code = "DUPLICATE_SKU";
        throw err;
      }
    }

    list[idx] = {
      ...list[idx],
      ...productData,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('if_products', JSON.stringify(list));
    return list[idx];
  },

  deleteProduct(id) {
    initMockDb();
    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');
    
    // Restrict check
    const used = orders.some(o => o.items.some(item => item.product_id === id));
    if (used) {
      const err = new Error("Cannot delete product referenced in order histories.");
      err.code = "DELETE_RESTRICTED";
      throw err;
    }

    let list = JSON.parse(localStorage.getItem('if_products') || '[]');
    list = list.filter(p => p.id !== id);
    localStorage.setItem('if_products', JSON.stringify(list));
    return { success: true };
  },

  getCustomers({ search, page, limit }) {
    initMockDb();
    let list = JSON.parse(localStorage.getItem('if_customers') || '[]');

    if (search) {
      const filter = search.toLowerCase();
      list = list.filter(c => 
        c.full_name.toLowerCase().includes(filter) || 
        c.email.toLowerCase().includes(filter) ||
        (c.phone_number && c.phone_number.includes(filter))
      );
    }

    const total = list.length;
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      success: true,
      total,
      page,
      limit,
      data: paginated
    };
  },

  getCustomerProfile(id) {
    initMockDb();
    const customers = JSON.parse(localStorage.getItem('if_customers') || '[]');
    const customer = customers.find(c => c.id === id);
    if (!customer) throw new Error("Customer profile not found");

    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');
    const clientOrders = orders.filter(o => o.customer_id === id);
    
    const total_spent = clientOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    return {
      ...customer,
      orders: clientOrders.map(o => ({
        id: o.id,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at
      })),
      total_spent,
      order_count: clientOrders.length
    };
  },

  createCustomer(customerData) {
    initMockDb();
    const list = JSON.parse(localStorage.getItem('if_customers') || '[]');

    if (list.some(c => c.email.toLowerCase() === customerData.email.toLowerCase())) {
      const err = new Error("Customer email already exists");
      err.code = "DUPLICATE_EMAIL";
      throw err;
    }

    const newCust = {
      id: "c_" + Math.random().toString(36).substring(2, 9),
      ...customerData,
      created_at: new Date().toISOString()
    };
    list.unshift(newCust);
    localStorage.setItem('if_customers', JSON.stringify(list));
    return newCust;
  },

  deleteCustomer(id) {
    initMockDb();
    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');
    if (orders.some(o => o.customer_id === id)) {
      const err = new Error("Cannot delete customer with order transactions history.");
      err.code = "DELETE_RESTRICTED";
      throw err;
    }

    let list = JSON.parse(localStorage.getItem('if_customers') || '[]');
    list = list.filter(c => c.id !== id);
    localStorage.setItem('if_customers', JSON.stringify(list));
    return { success: true };
  },

  getOrders({ page, limit }) {
    initMockDb();
    const list = JSON.parse(localStorage.getItem('if_orders') || '[]');
    
    const total = list.length;
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      success: true,
      total,
      page,
      limit,
      data: paginated
    };
  },

  createOrder(orderData) {
    initMockDb();
    const products = JSON.parse(localStorage.getItem('if_products') || '[]');
    const customers = JSON.parse(localStorage.getItem('if_customers') || '[]');
    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');

    const client = customers.find(c => c.id === orderData.customer_id);
    if (!client) throw new Error("Client not found");

    let total_amount = 0;
    const orderItems = [];

    // Atomic transaction checks
    for (const item of orderData.items) {
      const prodIdx = products.findIndex(p => p.id === item.product_id);
      if (prodIdx === -1) throw new Error("Product out of catalog bounds");
      
      const product = products[prodIdx];
      if (product.stock_quantity < item.quantity) {
        const err = new Error(`Inventory insufficient for product: ${product.name}`);
        err.code = "INSUFFICIENT_STOCK";
        throw err;
      }

      // Deduct stock quantity
      product.stock_quantity -= item.quantity;
      
      const subtotal = item.quantity * parseFloat(product.price);
      total_amount += subtotal;

      orderItems.push({
        id: "oi_" + Math.random().toString(36).substring(2, 9),
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal
      });
    }

    const newOrder = {
      id: "o_" + Math.random().toString(36).substring(2, 9),
      customer_id: client.id,
      customer_name: client.full_name,
      total_amount,
      status: "Pending",
      created_at: new Date().toISOString(),
      items: orderItems
    };

    orders.unshift(newOrder);
    localStorage.setItem('if_orders', JSON.stringify(orders));
    localStorage.setItem('if_products', JSON.stringify(products));

    return newOrder;
  },

  updateOrderStatus(id, status) {
    initMockDb();
    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');
    const products = JSON.parse(localStorage.getItem('if_products') || '[]');
    
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = orders[idx];
    const old_status = order.status;

    if (old_status === status) return order;

    // Status transition stock restoration
    if (status === 'Cancelled' && (old_status === 'Pending' || old_status === 'Processing')) {
      // Restore stock levels
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) prod.stock_quantity += item.quantity;
      });
    } else if (old_status === 'Cancelled' && status !== 'Cancelled') {
      // Re-deduct and validate stock levels
      for (const item of order.items) {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) {
          if (prod.stock_quantity < item.quantity) {
            const err = new Error(`Stock insufficient to reinstate order for: ${prod.name}`);
            err.code = "INSUFFICIENT_STOCK";
            throw err;
          }
          prod.stock_quantity -= item.quantity;
        }
      }
    }

    order.status = status;
    localStorage.setItem('if_orders', JSON.stringify(orders));
    localStorage.setItem('if_products', JSON.stringify(products));
    return order;
  },

  deleteOrder(id) {
    initMockDb();
    const orders = JSON.parse(localStorage.getItem('if_orders') || '[]');
    const products = JSON.parse(localStorage.getItem('if_products') || '[]');

    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = orders[idx];
    if (order.status === 'Pending' || order.status === 'Processing') {
      // Re-add stock
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) prod.stock_quantity += item.quantity;
      });
    }

    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem('if_orders', JSON.stringify(filtered));
    localStorage.setItem('if_products', JSON.stringify(products));
    return { success: true };
  }
};

/**
 * Fetch wrapper that intercepts failures and falls back to LocalStorage simulator
 */
async function apiCall(methodName, apiFunc, ...args) {
  if (useLocalMock) {
    console.warn(`[api] Calling LocalStorage simulator for ${methodName}`);
    return mockApi[methodName](...args);
  }

  try {
    return await apiFunc(...args);
  } catch (err) {
    // If request failed with network error (fetch down), enable LocalStorage simulator
    if (err instanceof TypeError || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      console.warn(`[api] Connection to ${API_BASE_URL} failed. Enabling high-fidelity browser database simulator.`);
      useLocalMock = true;
      initMockDb();
      return mockApi[methodName](...args);
    }
    // Else (standard backend 400 validation error), let standard bubble-up take care of it
    throw err;
  }
}

export const api = {
  // ----------------------------------------------------
  // DASHBOARD ENDPOINTS
  // ----------------------------------------------------
  async getDashboard() {
    return apiCall('getDashboard', async () => {
      const res = await fetch(`${API_BASE_URL}/dashboard`);
      return handleResponse(res);
    });
  },

  // ----------------------------------------------------
  // PRODUCTS ENDPOINTS
  // ----------------------------------------------------
  async getProducts(params = {}) {
    return apiCall('getProducts', async (p) => {
      const query = new URLSearchParams({
        page: String(p.page || 1),
        limit: String(p.limit || 10),
        sort_by: p.sort_by || 'created_at',
        sort_order: p.sort_order || 'desc'
      });
      if (p.search) query.append('search', p.search);
      if (p.category) query.append('category', p.category);
      if (p.stock_status) query.append('stock_status', p.stock_status);

      const res = await fetch(`${API_BASE_URL}/products/?${query}`);
      return handleResponse(res);
    }, params);
  },

  async getProduct(id) {
    return apiCall('getProduct', async (productId) => {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`);
      return handleResponse(res);
    }, id);
  },

  async createProduct(productData) {
    return apiCall('createProduct', async (data) => {
      const res = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }, productData);
  },

  async updateProduct(id, productData) {
    return apiCall('updateProduct', async (prodId, data) => {
      const res = await fetch(`${API_BASE_URL}/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }, id, productData);
  },

  async deleteProduct(id) {
    return apiCall('deleteProduct', async (prodId) => {
      const res = await fetch(`${API_BASE_URL}/products/${prodId}`, {
        method: 'DELETE'
      });
      return handleResponse(res);
    }, id);
  },

  // ----------------------------------------------------
  // CUSTOMERS ENDPOINTS
  // ----------------------------------------------------
  async getCustomers(params = {}) {
    return apiCall('getCustomers', async (p) => {
      const query = new URLSearchParams({ page: String(p.page || 1), limit: String(p.limit || 10) });
      if (p.search) query.append('search', p.search);

      const res = await fetch(`${API_BASE_URL}/customers/?${query}`);
      return handleResponse(res);
    }, params);
  },

  async getCustomerProfile(id) {
    return apiCall('getCustomerProfile', async (custId) => {
      const res = await fetch(`${API_BASE_URL}/customers/${custId}`);
      return handleResponse(res);
    }, id);
  },

  async createCustomer(customerData) {
    return apiCall('createCustomer', async (data) => {
      const res = await fetch(`${API_BASE_URL}/customers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }, customerData);
  },

  async deleteCustomer(id) {
    return apiCall('deleteCustomer', async (custId) => {
      const res = await fetch(`${API_BASE_URL}/customers/${custId}`, {
        method: 'DELETE'
      });
      return handleResponse(res);
    }, id);
  },

  // ----------------------------------------------------
  // ORDERS ENDPOINTS
  // ----------------------------------------------------
  async getOrders(params = {}) {
    return apiCall('getOrders', async (p) => {
      const query = new URLSearchParams({ page: String(p.page || 1), limit: String(p.limit || 10) });
      const res = await fetch(`${API_BASE_URL}/orders/?${query}`);
      return handleResponse(res);
    }, params);
  },

  async getOrder(id) {
    return apiCall('getOrder', async (ordId) => {
      const res = await fetch(`${API_BASE_URL}/orders/${ordId}`);
      return handleResponse(res);
    }, id);
  },

  async createOrder(orderData) {
    return apiCall('createOrder', async (data) => {
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }, orderData);
  },

  async updateOrderStatus(id, status) {
    return apiCall('updateOrderStatus', async (ordId, st) => {
      const res = await fetch(`${API_BASE_URL}/orders/${ordId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: st })
      });
      return handleResponse(res);
    }, id, status);
  },

  async deleteOrder(id) {
    return apiCall('deleteOrder', async (ordId) => {
      const res = await fetch(`${API_BASE_URL}/orders/${ordId}`, {
        method: 'DELETE'
      });
      return handleResponse(res);
    }, id);
  }
};

/**
 * Handle HTTP responses and translate standard error packets
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    const errorCode = data?.error_code || 'API_ERROR';
    
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = errorCode;
    error.success = false;
    throw error;
  }

  return data;
}
