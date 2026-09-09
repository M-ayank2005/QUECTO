package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"quecto-backend/internal/config"
	"quecto-backend/internal/database"
	"quecto-backend/internal/handlers"
	"quecto-backend/internal/middleware"
)

func main() {
	log.Println("Initializing Quecto Local Commerce API Backend...")

	cfg := config.LoadConfig()

	dbService, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Fatal DB error: %v", err)
	}
	defer func() {
		if dbService.DB != nil {
			dbService.DB.Close()
		}
	}()

	apiHandler := handlers.NewAPIHandler(dbService, cfg)

	// Chain middleware: CORS -> Logger -> Recoverer -> Router
	var handler http.Handler = apiHandler
	handler = middleware.Recoverer(handler)
	handler = middleware.Logger(handler)
	handler = middleware.CORS(handler)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("Quecto Backend API listening on http://localhost:%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server ListenAndServe failed: %v", err)
		}
	}()

	// Graceful shutdown on SIGINT / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down Quecto Backend API gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced shutdown: %v", err)
	}

	log.Println("Quecto Backend stopped successfully.")
}
