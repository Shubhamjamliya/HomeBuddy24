# 🔐 Production-Grade OTP System

This document details the fully implemented OTP authentication system for the Appzeto platform.

## ✅ Features Implemented

1.  **High-Performance Storage**:
    *   **Primary**: Redis (Fast, in-memory, TTL support).
    *   **Fallback**: MongoDB (Robust, activates automatically if Redis is down).
    *   **TTL**: Auto-expiry set to 5 minutes.

2.  **Security**:
    *   **SHA-256 Hashing**: OTPs are hashed before storage. Even database administrators cannot see user OTPs.
    *   **Rate Limiting**: Limits users to **3 OTP requests per 10 minutes** to prevent abuse.
    *   **Attempt Limiting**: Max **3 verification attempts** per OTP.

3.  **SMS Integration**:
    *   **Provider**: SMS India Hub.
    *   **Method**: HTTP/HTTPS API integration.
    *   **Compliance**: Supports DLT Template IDs.
    *   **Response Handling**: Robust handling of both String and JSON responses from the provider.

4.  **Developer Experience**:
    *   **Development Mode**: If `USE_DEFAULT_OTP=true` in `.env`, OTP is always `123456`.
    *   **Console Logging**: In development, generated OTPs are printed to the console for easy testing without SMS.

---

## 📂 Key Files

| File | Purpose |
| :--- | :--- |
| `services/smsService.js` | Handles SMS sending via SMS India Hub API. Includes error handling and credential validation. |
| `utils/redisOtp.util.js` | Core logic for Generating, Hashing, Storing (Redis/Mongo), and Verifying OTPs. |
| `controllers/*/authController.js` | Integrated into User, Vendor, and Worker authentication flows. |

---

## ⚙️ Configuration (.env)

Ensure these variables are set in your `.env` file:

```env
# SMS India Hub Credentials
SMS_INDIA_HUB_USERNAME=SPEEUP
SMS_INDIA_HUB_API_KEY=d5ebc5ace604448d95282cc4389e9ae4
SMS_INDIA_HUB_SENDER_ID=SMSHUB
SMS_INDIA_HUB_DLT_TEMPLATE_ID=1007801291964877107

# OTP Settings
OTP_EXPIRY_SECONDS=300       # 5 Minutes
OTP_MAX_ATTEMPTS=3           # 3 Tries
OTP_RATE_LIMIT=3             # 3 Requests
OTP_RATE_WINDOW=600          # 10 Minutes (in seconds)
```

---

## 🧪 How to Test

### 1. Send OTP
```http
POST /api/users/auth/send-otp
{
  "phone": "6261387233"
}
```

### 2. Verify / Register
```http
POST /api/users/auth/register
{
  "name": "Test User",
  "phone": "6261387233",
  "otp": "243590"  // Received via SMS
}
```

## 🚀 Status
**SYSTEM IS LIVE AND WORKING.** 
SMS delivery is confirmed working with the new credentials.
