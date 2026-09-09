package models

import "time"

type Shop struct {
	ID                string    `json:"id"`
	Name              string    `json:"name"`
	Category          string    `json:"category"`
	Address           string    `json:"address"`
	City              string    `json:"city"`
	Phone             string    `json:"phone"`
	Rating            float64   `json:"rating"`
	DeliveryFee       float64   `json:"delivery_fee"`
	MinOrder          float64   `json:"min_order"`
	IsOpen            bool      `json:"is_open"`
	ImageURL          string    `json:"image_url"`
	Latitude          float64   `json:"latitude"`
	Longitude         float64   `json:"longitude"`
	DeliveryRadiusKm  float64   `json:"delivery_radius_km"`
	Visibility        string    `json:"visibility"` // "public", "neighborhood_only"
	ServedApartments  []string  `json:"served_apartments"`
	DistanceKm        float64   `json:"distance_km,omitempty"`
	IsDeliverable     bool      `json:"is_deliverable"`
	CreatedAt         time.Time `json:"created_at"`
}

type Product struct {
	ID          string    `json:"id"`
	ShopID      string    `json:"shop_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Price       float64   `json:"price"`
	Unit        string    `json:"unit"`
	Stock       int       `json:"stock"`
	InStock     bool      `json:"in_stock"`
	ImageURL    string    `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
}

type OrderItem struct {
	ID          int     `json:"id,omitempty"`
	OrderID     string  `json:"order_id,omitempty"`
	ProductID   string  `json:"product_id"`
	ProductName string  `json:"product_name"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
}

type Order struct {
	ID              string      `json:"id"`
	ShopID          string      `json:"shop_id"`
	CustomerID      string      `json:"customer_id,omitempty"`
	CustomerEmail   string      `json:"customer_email,omitempty"`
	CustomerName    string      `json:"customer_name"`
	CustomerPhone   string      `json:"customer_phone"`
	DeliveryAddress string      `json:"delivery_address"`
	TotalAmount     float64     `json:"total_amount"`
	PaymentMethod   string      `json:"payment_method"` // "COD" or "UPI"
	PaymentStatus   string      `json:"payment_status"` // "pending" or "completed"
	OrderStatus     string      `json:"order_status"`   // "pending", "accepted", "out_for_delivery", "delivered", "cancelled"
	Notes           string      `json:"notes"`
	TrackingToken   string      `json:"tracking_token"` // Secure token returned to placing customer to track order privately
	CreatedAt       time.Time   `json:"created_at"`
	Items           []OrderItem `json:"items,omitempty"`
}

type CreateOrderRequest struct {
	ShopID          string      `json:"shop_id"`
	CustomerID      string      `json:"customer_id,omitempty"`
	CustomerEmail   string      `json:"customer_email,omitempty"`
	CustomerName    string      `json:"customer_name"`
	CustomerPhone   string      `json:"customer_phone"`
	DeliveryAddress string      `json:"delivery_address"`
	PaymentMethod   string      `json:"payment_method"`
	Notes           string      `json:"notes"`
	Items           []OrderItem `json:"items"`
}

type AdminStats struct {
	TotalOrders      int     `json:"total_orders"`
	PendingOrders    int     `json:"pending_orders"`
	DeliveredOrders  int     `json:"delivered_orders"`
	TotalRevenue     float64 `json:"total_revenue"`
	TotalProducts    int     `json:"total_products"`
	OutOfStockCount  int     `json:"out_of_stock_count"`
	AverageOrderVal  float64 `json:"average_order_val"`
	ShopStatusIsOpen bool    `json:"shop_status_is_open"`
}

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	Password     string    `json:"-"` // fallback / unhashed legacy
	PasswordHash string    `json:"-"` // bcrypt hash
	Name         string    `json:"name"`
	Phone        string    `json:"phone"`
	Role         string    `json:"role"` // "admin", "customer", "superadmin"
	ShopID       string    `json:"shop_id,omitempty"`
	Society      string    `json:"society,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type RegisterShopRequest struct {
	Name             string   `json:"name"`
	Category         string   `json:"category"`
	Address          string   `json:"address"`
	City             string   `json:"city"`
	Phone            string   `json:"phone"`
	DeliveryRadiusKm float64  `json:"delivery_radius_km"`
	ServedApartments []string `json:"served_apartments"`
	UPIID            string   `json:"upi_id"`
	OwnerName        string   `json:"owner_name"`
	OwnerEmail       string   `json:"owner_email"`
	Password         string   `json:"password"`
}

type CustomerSignUpRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
	Society  string `json:"society,omitempty"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type MasterLoginRequest struct {
	Password string `json:"password"`
}

type MasterOverview struct {
	TotalStores     int     `json:"total_stores"`
	TotalOrders     int     `json:"total_orders"`
	TotalRevenue    float64 `json:"total_revenue"`
	TotalCustomers  int     `json:"total_customers"`
	TotalProducts   int     `json:"total_products"`
	PendingOrders   int     `json:"pending_orders"`
	DeliveredOrders int     `json:"delivered_orders"`
}

type TroubleshootResult struct {
	Query  string   `json:"query"`
	Users  []*User  `json:"users"`
	Shops  []*Shop  `json:"shops"`
	Orders []*Order `json:"orders"`
}


