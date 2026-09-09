package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

var (
	ErrInvalidToken = errors.New("invalid authorization token")
	ErrExpiredToken = errors.New("authorization token has expired")
	jwtSecret       = []byte("quecto_production_super_secret_jwt_key_2026")
)

func SetJWTSecret(secret string) {
	if secret != "" {
		jwtSecret = []byte(secret)
	}
}

type Claims struct {
	UserID    string `json:"sub"`
	Email     string `json:"email"`
	Role      string `json:"role"` // "admin" (shopkeeper) or "customer"
	ShopID    string `json:"shop_id,omitempty"`
	ExpiresAt int64  `json:"exp"`
	IssuedAt  int64  `json:"iat"`
}

// GenerateToken creates an HMAC-SHA256 signed token
func GenerateToken(userID, email, role, shopID string, duration time.Duration) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID:    userID,
		Email:     email,
		Role:      role,
		ShopID:    shopID,
		IssuedAt:  now.Unix(),
		ExpiresAt: now.Add(duration).Unix(),
	}

	header := map[string]string{"alg": "HS256", "typ": "JWT"}
	headerBytes, _ := json.Marshal(header)
	claimsBytes, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	headerB64 := base64.RawURLEncoding.EncodeToString(headerBytes)
	claimsB64 := base64.RawURLEncoding.EncodeToString(claimsBytes)
	signingInput := fmt.Sprintf("%s.%s", headerB64, claimsB64)

	mac := hmac.New(sha256.New, jwtSecret)
	mac.Write([]byte(signingInput))
	signature := mac.Sum(nil)
	signatureB64 := base64.RawURLEncoding.EncodeToString(signature)

	return fmt.Sprintf("%s.%s", signingInput, signatureB64), nil
}

// ValidateToken parses and verifies the token signature and expiration
func ValidateToken(tokenString string) (*Claims, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, ErrInvalidToken
	}

	signingInput := fmt.Sprintf("%s.%s", parts[0], parts[1])
	sig, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return nil, ErrInvalidToken
	}

	mac := hmac.New(sha256.New, jwtSecret)
	mac.Write([]byte(signingInput))
	expectedSig := mac.Sum(nil)

	if !hmac.Equal(sig, expectedSig) {
		return nil, ErrInvalidToken
	}

	claimsBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidToken
	}

	var claims Claims
	if err := json.Unmarshal(claimsBytes, &claims); err != nil {
		return nil, ErrInvalidToken
	}

	if time.Now().Unix() > claims.ExpiresAt {
		return nil, ErrExpiredToken
	}

	return &claims, nil
}
