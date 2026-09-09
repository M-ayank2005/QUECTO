-- Quecto Database Schema for NeonDB PostgreSQL

CREATE TABLE IF NOT EXISTS shops (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Lucknow',
    phone VARCHAR(20) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.8,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    min_order NUMERIC(10,2) DEFAULT 99.00,
    is_open BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    shop_id VARCHAR(64) REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT '1 item',
    stock INT DEFAULT 20,
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    shop_id VARCHAR(64) REFERENCES shops(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'COD',
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64),
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

-- Seed Initial Shops
INSERT INTO shops (id, name, category, address, city, phone, rating, delivery_fee, min_order, is_open, image_url)
VALUES 
('shop-1', 'Gupta General & Kirana Store', 'Groceries', '12/4 Gomti Nagar, Near Manoj Pandey Chauraha', 'Lucknow', '+91-9876543210', 4.9, 0.00, 149.00, true, 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop'),
('shop-2', 'Awadh Fresh Dairy & Bakery', 'Dairy & Bakery', 'Shop 4, Alambagh Market', 'Lucknow', '+91-9876543211', 4.8, 15.00, 99.00, true, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop'),
('shop-3', 'Kisan Mandi Direct Produce', 'Fruits & Vegetables', 'Sector B, Indiranagar', 'Lucknow', '+91-9876543212', 4.7, 0.00, 199.00, true, 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop'),
('shop-4', 'Sanjeevani Medicos & Wellness', 'Pharmacy', 'Hazratganj Main Market', 'Lucknow', '+91-9876543213', 4.9, 20.00, 100.00, true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Products
INSERT INTO products (id, shop_id, name, description, category, price, unit, stock, in_stock, image_url)
VALUES
('prod-1', 'shop-1', 'Aashirvaad Shudh Chakki Atta', '100% whole wheat grain atta for soft rotis', 'Staples', 245.00, '5 kg', 25, true, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop'),
('prod-2', 'shop-1', 'Fortune Sunlite Refined Sunflower Oil', 'Light and healthy cooking oil', 'Oils', 140.00, '1 L', 18, true, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop'),
('prod-3', 'shop-1', 'Tata Salt Vaccum Evaporated', 'Iodised table salt with essential minerals', 'Staples', 28.00, '1 kg', 50, true, 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&auto=format&fit=crop'),
('prod-4', 'shop-1', 'India Gate Basmati Rice Feast Rozzana', 'Aromatic slender grains for daily meals', 'Rice & Grains', 95.00, '1 kg', 30, true, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop'),
('prod-5', 'shop-2', 'Amul Taaza Homogenised Toned Milk', 'Fresh pasteurized pure toned milk', 'Dairy', 27.00, '500 ml', 40, true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop'),
('prod-6', 'shop-2', 'Mother Dairy Classic Curd / Dahi', 'Thick and tasty plain curd', 'Dairy', 35.00, '400 g', 20, true, 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&auto=format&fit=crop'),
('prod-7', 'shop-2', 'Artisanal Fresh Brown Bread', 'High-fibre freshly baked bakery loaf', 'Bakery', 45.00, '400 g', 15, true, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop'),
('prod-8', 'shop-3', 'Fresh Farm Potatoes (Aloo)', 'Locally sourced fresh farm potatoes', 'Vegetables', 32.00, '1 kg', 80, true, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop'),
('prod-9', 'shop-3', 'Desi Hybrid Tomatoes (Tamatar)', 'Ripe, firm and juicy red tomatoes', 'Vegetables', 28.00, '1 kg', 60, true, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop'),
('prod-10', 'shop-3', 'Fresh Nasik Red Onions (Pyaz)', 'Sharp and flavourful cooking onions', 'Vegetables', 38.00, '1 kg', 75, true, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;
