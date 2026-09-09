package config

import (
	"bufio"
	"os"
	"strings"
)

type Config struct {
	Port                string
	DatabaseURL         string
	MasterAdminPassword string
}

func LoadConfig() *Config {
	loadDotEnv(".env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	databaseURL := os.Getenv("DATABASE_URL")

	masterAdminPassword := os.Getenv("QUECTO_ADMIN_PASSWORD")
	if masterAdminPassword == "" {
		masterAdminPassword = "quectomaster2026"
	}

	return &Config{
		Port:                port,
		DatabaseURL:         databaseURL,
		MasterAdminPassword: masterAdminPassword,
	}
}

// Simple custom .env loader without external dependencies
func loadDotEnv(filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			value := strings.TrimSpace(parts[1])
			value = strings.Trim(value, `"'`)
			if os.Getenv(key) == "" {
				os.Setenv(key, value)
			}
		}
	}
}
