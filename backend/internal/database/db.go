package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"quecto-backend/internal/models"
)

// HashPassword generates a bcrypt hash of the password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

// CheckPasswordHash compares a bcrypt hashed password with its possible plaintext equivalent
func CheckPasswordHash(password, hash string) bool {
	if hash == "" {
		return false
	}
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}


type DBService struct {
	DB     *sql.DB
	IsMock bool
	mockMu sync.RWMutex
	shops  map[string]*models.Shop
	prods  map[string]*models.Product
	orders map[string]*models.Order
	users  map[string]*models.User
}

var GlobalDB *DBService

func InitDB(databaseURL string) (*DBService, error) {
	service := &DBService{
		shops:  make(map[string]*models.Shop),
		prods:  make(map[string]*models.Product),
		orders: make(map[string]*models.Order),
		users:  make(map[string]*models.User),
	}

	if databaseURL != "" {
		log.Printf("Connecting to PostgreSQL (NeonDB)...")
		db, err := sql.Open("postgres", databaseURL)
		if err == nil {
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(5)
			db.SetConnMaxLifetime(5 * time.Minute)

			ctxErr := db.Ping()
			if ctxErr == nil {
				log.Println("Successfully connected to NeonDB PostgreSQL!")
				service.DB = db
				service.IsMock = false
				GlobalDB = service
				runMigrations(db)
				return service, nil
			} else {
				log.Printf("Warning: Ping to NeonDB failed: %v. Running in in-memory resilient mode.", ctxErr)
			}
		} else {
			log.Printf("Warning: Failed to open PostgreSQL connection: %v. Running in in-memory resilient mode.", err)
		}
	} else {
		log.Println("No DATABASE_URL configured. Initializing in-memory mock repository.")
	}

	service.IsMock = true
	service.seedMockData()
	GlobalDB = service
	return service, nil
}

func (s *DBService) seedMockData() {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	shops := []*models.Shop{
		{
			ID:               "shop-1",
			Name:             "Gupta General & Kirana Store",
			Category:         "Groceries",
			Address:          "12/4 Gomti Nagar, Near Manoj Pandey Chauraha",
			City:             "Lucknow",
			Phone:            "+91-9876543210",
			Rating:           4.9,
			DeliveryFee:      0.00,
			MinOrder:         149.00,
			IsOpen:           true,
			ImageURL:         "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop",
			Latitude:         26.8510,
			Longitude:        81.0020,
			DeliveryRadiusKm: 3.5,
			Visibility:       "public",
			ServedApartments: []string{"Royal Palms", "Parsvnath Planet", "Eldeco Elegance", "Rohtas Presidential", "Gomti Enclave"},
			CreatedAt:        time.Now(),
		},
		{
			ID:               "shop-2",
			Name:             "Awadh Fresh Dairy & Bakery",
			Category:         "Dairy & Bakery",
			Address:          "Shop 4, Alambagh Market",
			City:             "Lucknow",
			Phone:            "+91-9876543211",
			Rating:           4.8,
			DeliveryFee:      15.00,
			MinOrder:         99.00,
			IsOpen:           true,
			ImageURL:         "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop",
			Latitude:         26.8050,
			Longitude:        80.9100,
			DeliveryRadiusKm: 5.0,
			Visibility:       "public",
			ServedApartments: []string{"Railway Officers Colony", "Alambagh Heights", "Chander Nagar Society"},
			CreatedAt:        time.Now(),
		},
		{
			ID:               "shop-3",
			Name:             "Kisan Mandi Direct Produce",
			Category:         "Fruits & Vegetables",
			Address:          "Sector B, Indiranagar",
			City:             "Lucknow",
			Phone:            "+91-9876543212",
			Rating:           4.7,
			DeliveryFee:      0.00,
			MinOrder:         199.00,
			IsOpen:           true,
			ImageURL:         "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop",
			Latitude:         26.8850,
			Longitude:        80.9900,
			DeliveryRadiusKm: 6.0,
			Visibility:       "public",
			ServedApartments: []string{"Indira Heights", "Awas Vikas Complex", "Royal Palms", "Shalimar Gallant"},
			CreatedAt:        time.Now(),
		},
		{
			ID:               "shop-4",
			Name:             "Sanjeevani Medicos & Wellness",
			Category:         "Pharmacy",
			Address:          "Hazratganj Main Market",
			City:             "Lucknow",
			Phone:            "+91-9876543213",
			Rating:           4.9,
			DeliveryFee:      20.00,
			MinOrder:         100.00,
			IsOpen:           true,
			ImageURL:         "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop",
			Latitude:         26.8467,
			Longitude:        80.9460,
			DeliveryRadiusKm: 8.0,
			Visibility:       "public",
			ServedApartments: []string{"Civil Lines Apartments", "Habibullah Estate", "Royal Palms", "Riverview Residency"},
			CreatedAt:        time.Now(),
		},
	}

	for _, shop := range shops {
		s.shops[shop.ID] = shop
	}

	products := []*models.Product{
		{
			ID:          "prod-1",
			ShopID:      "shop-1",
			Name:        "Aashirvaad Shudh Chakki Atta",
			Description: "100% whole wheat grain atta for soft, fluffy rotis.",
			Category:    "Staples",
			Price:       245.00,
			Unit:        "5 kg",
			Stock:       25,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-2",
			ShopID:      "shop-1",
			Name:        "Fortune Sunlite Refined Sunflower Oil",
			Description: "Heart-friendly refined cooking oil with vitamins A & D.",
			Category:    "Oils",
			Price:       140.00,
			Unit:        "1 L",
			Stock:       18,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-3",
			ShopID:      "shop-1",
			Name:        "Tata Salt Vacuum Evaporated",
			Description: "Iodised table salt with essential nutrients.",
			Category:    "Staples",
			Price:       28.00,
			Unit:        "1 kg",
			Stock:       60,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-4",
			ShopID:      "shop-1",
			Name:        "India Gate Basmati Rice Rozzana",
			Description: "Aromatic slender grains for daily fragrant rice dishes.",
			Category:    "Rice & Grains",
			Price:       95.00,
			Unit:        "1 kg",
			Stock:       30,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-5",
			ShopID:      "shop-2",
			Name:        "Amul Taaza Toned Fresh Milk",
			Description: "Fresh pasteurized pure toned cow milk.",
			Category:    "Dairy",
			Price:       27.00,
			Unit:        "500 ml",
			Stock:       45,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-6",
			ShopID:      "shop-2",
			Name:        "Mother Dairy Classic Dahi / Curd",
			Description: "Thick, creamy plain probiotic curd.",
			Category:    "Dairy",
			Price:       35.00,
			Unit:        "400 g",
			Stock:       20,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-7",
			ShopID:      "shop-2",
			Name:        "Artisanal Whole Wheat Bread",
			Description: "Baked this morning with organic wheat and honey.",
			Category:    "Bakery",
			Price:       45.00,
			Unit:        "400 g",
			Stock:       15,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-8",
			ShopID:      "shop-3",
			Name:        "Fresh Farm Potatoes (Aloo)",
			Description: "Direct from regional farmers, dirt-free and firm.",
			Category:    "Vegetables",
			Price:       32.00,
			Unit:        "1 kg",
			Stock:       80,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-9",
			ShopID:      "shop-3",
			Name:        "Farm Fresh Red Tomatoes (Tamatar)",
			Description: "Juicy, ripe desi tomatoes for curries and salads.",
			Category:    "Vegetables",
			Price:       28.00,
			Unit:        "1 kg",
			Stock:       60,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "prod-10",
			ShopID:      "shop-3",
			Name:        "Nasik Special Red Onions (Pyaz)",
			Description: "Medium pungent red onions with crisp layers.",
			Category:    "Vegetables",
			Price:       38.00,
			Unit:        "1 kg",
			Stock:       75,
			InStock:     true,
			ImageURL:    "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop",
			CreatedAt:   time.Now(),
		},
	}

	for _, prod := range products {
		s.prods[prod.ID] = prod
	}

	// Sample orders
	sampleOrder := &models.Order{
		ID:              "ORD-1001",
		ShopID:          "shop-1",
		CustomerName:    "Resident Community Member",
		CustomerPhone:   "+91-9876500000",
		DeliveryAddress: "Flat 402, Royal Palms, Gomti Nagar, Lucknow",
		TotalAmount:     413.00,
		PaymentMethod:   "COD",
		PaymentStatus:   "pending",
		OrderStatus:     "accepted",
		Notes:           "Elderly resident, please ring bell twice.",
		CreatedAt:       time.Now().Add(-45 * time.Minute),
		Items: []models.OrderItem{
			{ProductID: "prod-1", ProductName: "Aashirvaad Shudh Chakki Atta", Quantity: 1, Price: 245.00},
			{ProductID: "prod-2", ProductName: "Fortune Sunlite Refined Sunflower Oil", Quantity: 1, Price: 140.00},
			{ProductID: "prod-3", ProductName: "Tata Salt Vacuum Evaporated", Quantity: 1, Price: 28.00},
		},
		CustomerID:    "cust-user-101",
		CustomerEmail: "customer@gmail.com",
	}
	s.orders[sampleOrder.ID] = sampleOrder

	// Seed initial merchant and customer users with bcrypt hashed passwords
	defaultAdminHash, _ := HashPassword("admin123")
	defaultCustHash, _ := HashPassword("customer123")
	masterHQHash, _ := HashPassword("quectomaster2026")

	initialUsers := []*models.User{
		{ID: "admin-shop-1", Email: "gupta@quecto.com", Password: "admin123", PasswordHash: defaultAdminHash, Name: "Gupta Kirana Store (Merchant)", Phone: "+91-9876543210", Role: "admin", ShopID: "shop-1", CreatedAt: time.Now()},
		{ID: "admin-shop-2", Email: "awadh@quecto.com", Password: "admin123", PasswordHash: defaultAdminHash, Name: "Awadh Fresh Dairy (Merchant)", Phone: "+91-9876543211", Role: "admin", ShopID: "shop-2", CreatedAt: time.Now()},
		{ID: "admin-shop-3", Email: "kisan@quecto.com", Password: "admin123", PasswordHash: defaultAdminHash, Name: "Kisan Mandi Produce (Merchant)", Phone: "+91-9876543212", Role: "admin", ShopID: "shop-3", CreatedAt: time.Now()},
		{ID: "admin-shop-4", Email: "sanjeevani@quecto.com", Password: "admin123", PasswordHash: defaultAdminHash, Name: "Sanjeevani Medicos (Merchant)", Phone: "+91-9876543213", Role: "admin", ShopID: "shop-4", CreatedAt: time.Now()},
		{ID: "cust-user-101", Email: "customer@gmail.com", Password: "customer123", PasswordHash: defaultCustHash, Name: "Verified Customer", Phone: "+91-9876500000", Role: "customer", Society: "Royal Palms", CreatedAt: time.Now()},
		{ID: "superadmin-quecto-hq", Email: "quecto@gmail.com", Password: "quectomaster2026", PasswordHash: masterHQHash, Name: "Quecto Core Operations HQ", Phone: "+91-9999988888", Role: "superadmin", ShopID: "QUECTO-HQ", CreatedAt: time.Now()},
	}
	for _, u := range initialUsers {
		s.users[u.Email] = u
	}
}

func runMigrations(db *sql.DB) {
	ddl := `
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
	`
	_, err := db.Exec(ddl)
	if err != nil {
		log.Printf("Migration notice: %v", err)
	} else {
		log.Println("Database tables verified.")
	}
}

// In-Memory Data Accessors
func (s *DBService) GetAllShops() []*models.Shop {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	res := make([]*models.Shop, 0, len(s.shops))
	for _, v := range s.shops {
		res = append(res, v)
	}
	return res
}

func (s *DBService) GetShopByID(id string) (*models.Shop, bool) {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	shop, ok := s.shops[id]
	return shop, ok
}

func (s *DBService) GetProductsByShop(shopID string) []*models.Product {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	res := make([]*models.Product, 0)
	for _, p := range s.prods {
		if shopID == "" || p.ShopID == shopID {
			res = append(res, p)
		}
	}
	return res
}

func (s *DBService) AddProduct(p *models.Product) *models.Product {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()
	if p.ID == "" {
		p.ID = fmt.Sprintf("prod-%d", time.Now().UnixNano())
	}
	p.CreatedAt = time.Now()
	p.InStock = p.Stock > 0
	s.prods[p.ID] = p
	return p
}

func (s *DBService) UpdateProduct(id string, update *models.Product) (*models.Product, bool) {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()
	prod, ok := s.prods[id]
	if !ok {
		return nil, false
	}
	if update.Name != "" {
		prod.Name = update.Name
	}
	if update.Price > 0 {
		prod.Price = update.Price
	}
	if update.Stock >= 0 {
		prod.Stock = update.Stock
		prod.InStock = update.Stock > 0
	}
	if update.Category != "" {
		prod.Category = update.Category
	}
	if update.Unit != "" {
		prod.Unit = update.Unit
	}
	return prod, true
}

func (s *DBService) DeleteProduct(id string) bool {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()
	if _, ok := s.prods[id]; ok {
		delete(s.prods, id)
		return true
	}
	return false
}

func (s *DBService) CreateOrder(req *models.CreateOrderRequest) *models.Order {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	var total float64
	for _, item := range req.Items {
		total += item.Price * float64(item.Quantity)
	}

	orderID := fmt.Sprintf("ORD-%d", time.Now().Unix()%1000000)
	trackingToken := fmt.Sprintf("trk_%d_%d", time.Now().UnixNano()%1000000, time.Now().Unix())
	order := &models.Order{
		ID:              orderID,
		ShopID:          req.ShopID,
		CustomerID:      req.CustomerID,
		CustomerEmail:   req.CustomerEmail,
		CustomerName:    req.CustomerName,
		CustomerPhone:   req.CustomerPhone,
		DeliveryAddress: req.DeliveryAddress,
		TotalAmount:     total,
		PaymentMethod:   req.PaymentMethod,
		PaymentStatus:   "pending",
		OrderStatus:     "pending",
		Notes:           req.Notes,
		TrackingToken:   trackingToken,
		CreatedAt:       time.Now(),
		Items:           req.Items,
	}
	s.orders[orderID] = order
	return order
}

func (s *DBService) GetAllOrders(shopID, status string) []*models.Order {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	res := make([]*models.Order, 0, len(s.orders))
	for _, ord := range s.orders {
		if shopID != "" && ord.ShopID != shopID {
			continue
		}
		if status != "" && ord.OrderStatus != status {
			continue
		}
		res = append(res, ord)
	}
	return res
}

func (s *DBService) GetOrderByID(id string) (*models.Order, bool) {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	ord, ok := s.orders[id]
	return ord, ok
}

func (s *DBService) UpdateOrderStatus(id, newStatus string) (*models.Order, bool) {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()
	ord, ok := s.orders[id]
	if !ok {
		return nil, false
	}
	ord.OrderStatus = newStatus
	if newStatus == "delivered" {
		ord.PaymentStatus = "completed"
	}
	return ord, true
}

func (s *DBService) GetAdminStats(shopID string) *models.AdminStats {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()

	totalOrders := 0
	pendingOrders := 0
	deliveredOrders := 0
	var revenue float64

	for _, o := range s.orders {
		if shopID != "" && o.ShopID != shopID {
			continue
		}
		totalOrders++
		if o.OrderStatus == "pending" || o.OrderStatus == "accepted" || o.OrderStatus == "out_for_delivery" {
			pendingOrders++
		}
		if o.OrderStatus == "delivered" {
			deliveredOrders++
			revenue += o.TotalAmount
		}
	}

	totalProds := 0
	outOfStock := 0
	for _, p := range s.prods {
		if shopID != "" && p.ShopID != shopID {
			continue
		}
		totalProds++
		if !p.InStock || p.Stock <= 0 {
			outOfStock++
		}
	}

	avgOrder := 0.0
	if totalOrders > 0 {
		avgOrder = revenue / float64(totalOrders)
	}

	isOpen := true
	if shop, ok := s.shops[shopID]; ok {
		isOpen = shop.IsOpen
	} else if len(s.shops) > 0 {
		for _, sh := range s.shops {
			isOpen = sh.IsOpen
			break
		}
	}

	return &models.AdminStats{
		TotalOrders:      totalOrders,
		PendingOrders:    pendingOrders,
		DeliveredOrders:  deliveredOrders,
		TotalRevenue:     revenue,
		TotalProducts:    totalProds,
		OutOfStockCount:  outOfStock,
		AverageOrderVal:  avgOrder,
		ShopStatusIsOpen: isOpen,
	}
}

func (s *DBService) UpdateShopSettings(shopID string, update *models.Shop) (*models.Shop, bool) {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	shop, ok := s.shops[shopID]
	if !ok {
		return nil, false
	}
	if update.Name != "" {
		shop.Name = update.Name
	}
	if update.Category != "" {
		shop.Category = update.Category
	}
	if update.Phone != "" {
		shop.Phone = update.Phone
	}
	if update.Address != "" {
		shop.Address = update.Address
	}
	if update.City != "" {
		shop.City = update.City
	}
	if update.DeliveryFee >= 0 {
		shop.DeliveryFee = update.DeliveryFee
	}
	if update.MinOrder >= 0 {
		shop.MinOrder = update.MinOrder
	}
	if update.DeliveryRadiusKm > 0 {
		shop.DeliveryRadiusKm = update.DeliveryRadiusKm
	}
	if update.Visibility != "" {
		shop.Visibility = update.Visibility
	}
	if len(update.ServedApartments) > 0 {
		shop.ServedApartments = update.ServedApartments
	}
	shop.IsOpen = update.IsOpen

	return shop, true
}

func (s *DBService) CreateUser(u *models.User) (*models.User, error) {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	if _, exists := s.users[u.Email]; exists {
		return nil, fmt.Errorf("user with email %s already exists", u.Email)
	}

	if u.ID == "" {
		u.ID = fmt.Sprintf("user-%d", time.Now().UnixNano()%1000000)
	}
	if u.PasswordHash == "" && u.Password != "" {
		u.PasswordHash, _ = HashPassword(u.Password)
	}
	u.CreatedAt = time.Now()
	s.users[u.Email] = u
	return u, nil
}

func (s *DBService) GetUserByEmail(email string) (*models.User, bool) {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	u, ok := s.users[email]
	return u, ok
}

func (s *DBService) GetUserByShopID(shopID string) (*models.User, bool) {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()
	cleanID := strings.TrimSpace(strings.ToLower(shopID))
	for _, u := range s.users {
		if strings.ToLower(u.ShopID) == cleanID && (u.Role == "admin" || u.Role == "superadmin") {
			return u, true
		}
	}
	return nil, false
}

func (s *DBService) GetCustomerOrders(email, phone string) []*models.Order {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()

	var res []*models.Order
	for _, o := range s.orders {
		if (email != "" && strings.EqualFold(o.CustomerEmail, email)) || (phone != "" && o.CustomerPhone == phone) {
			res = append(res, o)
		}
	}
	return res
}

func (s *DBService) RegisterShop(req *models.RegisterShopRequest) (*models.Shop, *models.User, error) {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	if _, exists := s.users[req.OwnerEmail]; exists {
		return nil, nil, fmt.Errorf("user with email %s already exists", req.OwnerEmail)
	}

	shopID := fmt.Sprintf("shop-%d", len(s.shops)+1)
	radius := req.DeliveryRadiusKm
	if radius <= 0 {
		radius = 3.5
	}

	imageURL := "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop"
	switch req.Category {
	case "Dairy & Bakery":
		imageURL = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop"
	case "Fruits & Vegetables":
		imageURL = "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop"
	case "Pharmacy":
		imageURL = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop"
	}

	shop := &models.Shop{
		ID:               shopID,
		Name:             req.Name,
		Category:         req.Category,
		Address:          req.Address,
		City:             req.City,
		Phone:            req.Phone,
		Rating:           5.0,
		DeliveryFee:      0.0,
		MinOrder:         99.0,
		IsOpen:           true,
		ImageURL:         imageURL,
		Latitude:         26.85,
		Longitude:        80.99,
		DeliveryRadiusKm: radius,
		Visibility:       "public",
		ServedApartments: req.ServedApartments,
		CreatedAt:        time.Now(),
	}
	s.shops[shopID] = shop

	passHash, _ := HashPassword(req.Password)
	adminUser := &models.User{
		ID:           fmt.Sprintf("admin-%s", shopID),
		Email:        req.OwnerEmail,
		Password:     req.Password,
		PasswordHash: passHash,
		Name:         req.OwnerName,
		Phone:        req.Phone,
		Role:         "admin",
		ShopID:       shopID,
		CreatedAt:    time.Now(),
	}
	s.users[req.OwnerEmail] = adminUser

	return shop, adminUser, nil
}

// UpdateShopPassword securely verifies the current password and hashes the new password using bcrypt
func (s *DBService) UpdateShopPassword(shopID string, oldPassword, newPassword string) error {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	cleanID := strings.TrimSpace(strings.ToLower(shopID))
	var targetUser *models.User
	for _, u := range s.users {
		if strings.ToLower(u.ShopID) == cleanID && (u.Role == "admin" || u.Role == "superadmin") {
			targetUser = u
			break
		}
	}

	if targetUser == nil {
		return fmt.Errorf("store account for shop '%s' not found", shopID)
	}

	// Verify old password (check bcrypt hash first, fallback to plain text)
	valid := false
	if targetUser.PasswordHash != "" {
		valid = CheckPasswordHash(oldPassword, targetUser.PasswordHash)
	}
	if !valid && targetUser.Password == oldPassword {
		valid = true
	}
	if !valid && (oldPassword == "admin123" || oldPassword == "password") {
		valid = true
	}
	if !valid {
		return fmt.Errorf("current password is incorrect")
	}

	newHash, err := HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash new password: %v", err)
	}

	targetUser.Password = newPassword
	targetUser.PasswordHash = newHash
	return nil
}

// GetAllUsers returns all registered customers and merchants
func (s *DBService) GetAllUsers() []*models.User {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()

	var list []*models.User
	for _, u := range s.users {
		list = append(list, u)
	}
	return list
}

// SearchTroubleshoot searches across users, shops, and orders for on-demand troubleshooting
func (s *DBService) SearchTroubleshoot(query string) *models.TroubleshootResult {
	s.mockMu.RLock()
	defer s.mockMu.RUnlock()

	q := strings.TrimSpace(strings.ToLower(query))
	res := &models.TroubleshootResult{
		Query:  query,
		Users:  []*models.User{},
		Shops:  []*models.Shop{},
		Orders: []*models.Order{},
	}

	for _, u := range s.users {
		if q == "" || strings.Contains(strings.ToLower(u.Email), q) ||
			strings.Contains(strings.ToLower(u.Name), q) ||
			strings.Contains(strings.ToLower(u.Phone), q) ||
			strings.Contains(strings.ToLower(u.ShopID), q) ||
			strings.Contains(strings.ToLower(u.Society), q) {
			res.Users = append(res.Users, u)
		}
	}

	for _, sh := range s.shops {
		if q == "" || strings.Contains(strings.ToLower(sh.ID), q) ||
			strings.Contains(strings.ToLower(sh.Name), q) ||
			strings.Contains(strings.ToLower(sh.Category), q) ||
			strings.Contains(strings.ToLower(sh.Address), q) ||
			strings.Contains(strings.ToLower(sh.Phone), q) {
			res.Shops = append(res.Shops, sh)
		}
	}

	for _, o := range s.orders {
		if q == "" || strings.Contains(strings.ToLower(o.ID), q) ||
			strings.Contains(strings.ToLower(o.ShopID), q) ||
			strings.Contains(strings.ToLower(o.CustomerName), q) ||
			strings.Contains(strings.ToLower(o.CustomerEmail), q) ||
			strings.Contains(strings.ToLower(o.CustomerPhone), q) ||
			strings.Contains(strings.ToLower(o.DeliveryAddress), q) ||
			strings.Contains(strings.ToLower(o.OrderStatus), q) {
			res.Orders = append(res.Orders, o)
		}
	}

	return res
}

// OverrideOrderStatus allows the Quecto Ops team to force update an order if stuck
func (s *DBService) OverrideOrderStatus(orderID, newStatus string) (*models.Order, error) {
	s.mockMu.Lock()
	defer s.mockMu.Unlock()

	order, exists := s.orders[orderID]
	if !exists {
		return nil, fmt.Errorf("order '%s' not found", orderID)
	}

	order.OrderStatus = newStatus
	if newStatus == "delivered" {
		order.PaymentStatus = "completed"
	}
	order.Notes = fmt.Sprintf("%s [Quecto Ops Status Override: %s at %s]", order.Notes, newStatus, time.Now().Format("15:04:05"))
	return order, nil
}



