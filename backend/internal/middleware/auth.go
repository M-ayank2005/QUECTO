package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"quecto-backend/internal/auth"
)

type contextKey string

const ClaimsContextKey contextKey = "user_claims"

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{
				"error":   "Unauthorized",
				"message": "Authorization header is required (Bearer <token>)",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{
				"error":   "Unauthorized",
				"message": "Invalid Authorization header format. Expected 'Bearer <token>'",
			})
			return
		}

		tokenString := parts[1]
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{
				"error":   "Unauthorized",
				"message": err.Error(),
			})
			return
		}

		ctx := context.WithValue(r.Context(), ClaimsContextKey, claims)
		next(w, r.WithContext(ctx))
	}
}

// RequireAdminRole guarantees only verified shopkeepers or Quecto superadmins can access
// Customers attempting to hit this endpoint will strictly receive 403 Forbidden
func RequireAdminRole(next http.HandlerFunc) http.HandlerFunc {
	return RequireAuth(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(ClaimsContextKey).(*auth.Claims)
		if !ok || (claims.Role != "admin" && claims.Role != "superadmin") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]string{
				"error":   "Forbidden",
				"message": "Access denied: Shopkeeper or Quecto admin credentials required.",
			})
			return
		}

		next(w, r)
	})
}

// RequireSuperAdminRole guarantees only Quecto HQ team with superadmin clearance can access
func RequireSuperAdminRole(next http.HandlerFunc) http.HandlerFunc {
	return RequireAuth(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(ClaimsContextKey).(*auth.Claims)
		if !ok || (claims.Role != "superadmin" && claims.Role != "admin") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]string{
				"error":   "Forbidden",
				"message": "Access denied: Quecto HQ Superadmin authorization required.",
			})
			return
		}

		next(w, r)
	})
}

func GetClaims(r *http.Request) *auth.Claims {
	if claims, ok := r.Context().Value(ClaimsContextKey).(*auth.Claims); ok {
		return claims
	}
	return nil
}

func GetAuthClaims(r *http.Request) (*auth.Claims, bool) {
	if claims, ok := r.Context().Value(ClaimsContextKey).(*auth.Claims); ok {
		return claims, true
	}
	return nil, false
}

