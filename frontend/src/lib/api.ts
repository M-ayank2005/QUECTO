export interface Shop {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  delivery_fee: number;
  min_order: number;
  is_open: boolean;
  image_url: string;
  latitude?: number;
  longitude?: number;
  delivery_radius_km?: number;
  visibility?: string;
  served_apartments?: string[];
  distance_km?: number;
  is_deliverable?: boolean;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  in_stock: boolean;
  image_url: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes?: string;
  tracking_token: string;
  created_at: string;
  items: OrderItem[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Standalone fallback mock data for instant resilient offline rendering
const FALLBACK_SHOPS: Shop[] = [
  {
    id: 'shop-1',
    name: 'Gupta General & Kirana Store',
    category: 'Groceries',
    address: '12/4 Gomti Nagar, Near Manoj Pandey Chauraha',
    city: 'Lucknow',
    phone: '+91-9876543210',
    rating: 4.9,
    delivery_fee: 0.0,
    min_order: 149.0,
    is_open: true,
    image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop',
    latitude: 26.851,
    longitude: 81.002,
    delivery_radius_km: 3.5,
    visibility: 'public',
    served_apartments: ['Royal Palms', 'Parsvnath Planet', 'Eldeco Elegance', 'Rohtas Presidential', 'Gomti Enclave'],
    distance_km: 0.6,
    is_deliverable: true,
  },
  {
    id: 'shop-2',
    name: 'Awadh Fresh Dairy & Bakery',
    category: 'Dairy & Bakery',
    address: 'Shop 4, Alambagh Market',
    city: 'Lucknow',
    phone: '+91-9876543211',
    rating: 4.8,
    delivery_fee: 15.0,
    min_order: 99.0,
    is_open: true,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
    latitude: 26.805,
    longitude: 80.91,
    delivery_radius_km: 5.0,
    visibility: 'public',
    served_apartments: ['Railway Officers Colony', 'Alambagh Heights', 'Chander Nagar Society'],
    distance_km: 9.8,
    is_deliverable: false,
  },
  {
    id: 'shop-3',
    name: 'Kisan Mandi Direct Produce',
    category: 'Fruits & Vegetables',
    address: 'Sector B, Indiranagar',
    city: 'Lucknow',
    phone: '+91-9876543212',
    rating: 4.7,
    delivery_fee: 0.0,
    min_order: 199.0,
    is_open: true,
    image_url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop',
    latitude: 26.885,
    longitude: 80.99,
    delivery_radius_km: 6.0,
    visibility: 'public',
    served_apartments: ['Indira Heights', 'Awas Vikas Complex', 'Royal Palms', 'Shalimar Gallant'],
    distance_km: 4.2,
    is_deliverable: true,
  },
  {
    id: 'shop-4',
    name: 'Sanjeevani Medicos & Wellness',
    category: 'Pharmacy',
    address: 'Hazratganj Main Market',
    city: 'Lucknow',
    phone: '+91-9876543213',
    rating: 4.9,
    delivery_fee: 20.0,
    min_order: 100.0,
    is_open: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop',
    latitude: 26.8467,
    longitude: 80.946,
    delivery_radius_km: 8.0,
    visibility: 'public',
    served_apartments: ['Civil Lines Apartments', 'Habibullah Estate', 'Royal Palms', 'Riverview Residency'],
    distance_km: 5.8,
    is_deliverable: true,
  },
];

const FALLBACK_PRODUCTS: Record<string, Product[]> = {
  'shop-1': [
    {
      id: 'prod-1',
      shop_id: 'shop-1',
      name: 'Aashirvaad Shudh Chakki Atta',
      description: '100% whole wheat grain atta for soft, fluffy rotis.',
      category: 'Staples',
      price: 245.0,
      unit: '5 kg',
      stock: 25,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-2',
      shop_id: 'shop-1',
      name: 'Fortune Sunlite Refined Sunflower Oil',
      description: 'Heart-friendly refined cooking oil with vitamins A & D.',
      category: 'Oils',
      price: 140.0,
      unit: '1 L',
      stock: 18,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-3',
      shop_id: 'shop-1',
      name: 'Tata Salt Vacuum Evaporated',
      description: 'Iodised table salt with essential nutrients.',
      category: 'Staples',
      price: 28.0,
      unit: '1 kg',
      stock: 60,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-4',
      shop_id: 'shop-1',
      name: 'India Gate Basmati Rice Rozzana',
      description: 'Aromatic slender grains for daily fragrant rice dishes.',
      category: 'Rice & Grains',
      price: 95.0,
      unit: '1 kg',
      stock: 30,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop',
    },
  ],
  'shop-2': [
    {
      id: 'prod-5',
      shop_id: 'shop-2',
      name: 'Amul Taaza Toned Fresh Milk',
      description: 'Fresh pasteurized pure toned cow milk.',
      category: 'Dairy',
      price: 27.0,
      unit: '500 ml',
      stock: 45,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-6',
      shop_id: 'shop-2',
      name: 'Mother Dairy Classic Dahi / Curd',
      description: 'Thick, creamy plain probiotic curd.',
      category: 'Dairy',
      price: 35.0,
      unit: '400 g',
      stock: 20,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-7',
      shop_id: 'shop-2',
      name: 'Artisanal Whole Wheat Bread',
      description: 'Baked this morning with organic wheat and honey.',
      category: 'Bakery',
      price: 45.0,
      unit: '400 g',
      stock: 15,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop',
    },
  ],
  'shop-3': [
    {
      id: 'prod-8',
      shop_id: 'shop-3',
      name: 'Fresh Farm Potatoes (Aloo)',
      description: 'Direct from regional farmers, dirt-free and firm.',
      category: 'Vegetables',
      price: 32.0,
      unit: '1 kg',
      stock: 80,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-9',
      shop_id: 'shop-3',
      name: 'Farm Fresh Red Tomatoes (Tamatar)',
      description: 'Juicy, ripe desi tomatoes for curries and salads.',
      category: 'Vegetables',
      price: 28.0,
      unit: '1 kg',
      stock: 60,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop',
    },
    {
      id: 'prod-10',
      shop_id: 'shop-3',
      name: 'Nasik Special Red Onions (Pyaz)',
      description: 'Medium pungent red onions with crisp layers.',
      category: 'Vegetables',
      price: 38.0,
      unit: '1 kg',
      stock: 75,
      in_stock: true,
      image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop',
    },
  ],
};

export async function fetchShops(
  category?: string,
  query?: string,
  apartment?: string,
  radius?: number,
  broad?: boolean
): Promise<Shop[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (query) params.append('q', query);
    if (apartment) params.append('apartment', apartment);
    if (radius) params.append('radius', radius.toString());
    if (broad) params.append('broad', 'true');

    const res = await fetch(`${API_BASE}/shops?${params.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Backend connection note, using local catalog data:', e);
  }

  // Fallback filtering with apartment and broad search logic
  return FALLBACK_SHOPS.filter((s) => {
    if (category && category !== 'All' && s.category.toLowerCase() !== category.toLowerCase()) return false;
    if (query) {
      const q = query.toLowerCase();
      const matchQuery = s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
      if (!matchQuery) return false;
    }

    // Apartment match
    const apartmentMatch =
      apartment &&
      s.served_apartments?.some(
        (apt) =>
          apt.toLowerCase().includes(apartment.toLowerCase()) ||
          apartment.toLowerCase().includes(apt.toLowerCase())
      );

    // If narrow search (not broad), only show if deliverable or within radius or matches apartment
    if (!broad) {
      const maxR = radius || 4.5;
      if (!s.is_deliverable && !apartmentMatch && (s.distance_km || 10) > maxR) {
        return false;
      }
    }

    return true;
  });
}

export async function fetchShop(id: string): Promise<Shop | null> {
  try {
    const res = await fetch(`${API_BASE}/shops/${id}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend connection note:', e);
  }
  return FALLBACK_SHOPS.find((s) => s.id === id) || FALLBACK_SHOPS[0];
}

export async function fetchShopProducts(shopId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/shops/${shopId}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Backend connection note:', e);
  }
  return FALLBACK_PRODUCTS[shopId] || FALLBACK_PRODUCTS['shop-1'] || [];
}

export async function createOrder(payload: {
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  notes?: string;
  items: OrderItem[];
}): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend connection note, generating local order confirmation:', e);
  }

  // Resilient fallback order simulation
  const randomId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    id: randomId,
    shop_id: payload.shop_id,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    delivery_address: payload.delivery_address,
    total_amount: total,
    payment_method: payload.payment_method,
    payment_status: 'pending',
    order_status: 'accepted',
    notes: payload.notes,
    tracking_token: 'trk_' + Date.now(),
    created_at: new Date().toISOString(),
    items: payload.items,
  };
}

export async function fetchOrder(id: string, trackingToken?: string): Promise<Order | null> {
  try {
    const tokenQuery = trackingToken ? `?token=${encodeURIComponent(trackingToken)}` : '';
    const res = await fetch(`${API_BASE}/orders/${id}${tokenQuery}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend connection note:', e);
  }
  return null;
}

export async function loginCustomer(email: string, pass: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass, role: 'customer' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Invalid credentials');
  return data;
}

export async function signupCustomer(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  society?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create account');
  return data;
}

export async function registerShop(payload: {
  name: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  delivery_radius_km: number;
  served_apartments: string[];
  upi_id: string;
  owner_name: string;
  owner_email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/shops/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register shop');
  return data;
}

export async function fetchCustomerOrders(email?: string, phone?: string): Promise<Order[]> {
  try {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phone) params.append('phone', phone);
    const res = await fetch(`${API_BASE}/customer/orders?${params.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend connection note:', e);
  }

  // Fallback to sample customer orders
  return [
    {
      id: 'ORD-1001',
      shop_id: 'shop-1',
      customer_name: 'Resident Community Member',
      customer_phone: '+91-9876500000',
      delivery_address: 'Flat 402, Royal Palms, Gomti Nagar, Lucknow',
      total_amount: 413.0,
      payment_method: 'COD',
      payment_status: 'pending',
      order_status: 'delivered',
      notes: 'Ring bell twice',
      tracking_token: 'trk_1001',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      items: [
        { product_id: 'prod-1', product_name: 'Aashirvaad Shudh Chakki Atta', quantity: 1, price: 245.0 },
        { product_id: 'prod-2', product_name: 'Fortune Sunlite Refined Sunflower Oil', quantity: 1, price: 140.0 },
        { product_id: 'prod-3', product_name: 'Tata Salt Vacuum Evaporated', quantity: 1, price: 28.0 },
      ],
    },
  ];
}
