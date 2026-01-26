# Appzeto Backend Requirements

## Overview
The Appzeto backend is a comprehensive Node.js/Express API that powers a multi-sided platform connecting users, vendors, workers, and administrators for home service bookings.

---

## 🔧 Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js v4.21.2
- **Database**: MongoDB (via Mongoose v8.19.3)
- **Language**: JavaScript (ES6+)

### Key Dependencies

#### Authentication & Security
- `jsonwebtoken` (v9.0.2) - JWT-based authentication
- `bcryptjs` (v3.0.3) - Password hashing
- `helmet` (v7.1.0) - Security headers
- `cors` (v2.8.5) - Cross-origin resource sharing
- `express-rate-limit` (v7.4.0) - API rate limiting
- `cookie-parser` (v1.4.7) - Cookie handling

#### File Management
- `multer` (v1.4.5-lts.1) - File upload handling
- `cloudinary` (v1.41.3) - Cloud storage for images
- `multer-storage-cloudinary` (v4.0.0) - Cloudinary integration
- `streamifier` (v0.1.1) - Stream conversion

#### Payment Processing
- `razorpay` (v2.9.5) - Payment gateway integration

#### Communication
- `socket.io` (v4.8.1) - Real-time bidirectional communication
- `nodemailer` (v6.9.15) - Email service

#### Utilities
- `express-validator` (v7.3.0) - Request validation
- `morgan` (v1.10.0) - HTTP request logging
- `dotenv` (v16.6.1) - Environment variable management
- `axios` (v1.13.2) - HTTP client
- `pdfkit` (v0.15.2) - PDF generation

#### Development Tools
- `nodemon` (v3.1.10) - Auto-restart during development
- `mongodb-memory-server` (v10.1.4) - In-memory MongoDB for testing
- `supertest` (v6.3.4) - API testing

---

## 📁 Project Structure

```
Backend/
├── api/                    # API-specific utilities
├── config/                 # Configuration files
│   └── db.js              # MongoDB connection
├── controllers/           # Business logic
│   ├── adminControllers/
│   ├── bookingControllers/
│   ├── notificationControllers/
│   ├── paymentControllers/
│   ├── publicControllers/
│   ├── userControllers/
│   ├── vendorControllers/
│   └── workerControllers/
├── middleware/            # Express middleware
│   ├── authMiddleware.js
│   ├── rateLimiter.js
│   ├── roleMiddleware.js
│   └── uploadMiddleware.js
├── models/               # Mongoose schemas
│   ├── Admin.js
│   ├── Booking.js
│   ├── Cart.js
│   ├── Category.js
│   ├── HomeContent.js
│   ├── Notification.js
│   ├── Service.js
│   ├── Token.js
│   ├── User.js
│   ├── Vendor.js
│   └── Worker.js
├── routes/              # API route definitions
│   ├── admin-routes/
│   ├── booking-routes/
│   ├── payment-routes/
│   ├── public-routes/
│   ├── user-routes/
│   ├── vendor-routes/
│   └── worker-routes/
├── scripts/            # Database seeding & utilities
├── services/           # Business services
│   ├── cloudinaryService.js
│   ├── emailService.js
│   ├── fileStorageService.js
│   ├── locationService.js
│   ├── otpService.js
│   └── razorpayService.js
├── sockets/           # Socket.io handlers
├── tests/             # Test files
├── utils/             # Utility functions
├── validators/        # Input validation schemas
├── .env              # Environment variables (not in git)
├── env.example       # Environment template
├── package.json      # Dependencies & scripts
└── server.js         # Application entry point
```

---

## 🔐 Environment Variables Required

### Server Configuration
```env
PORT=5000
NODE_ENV=development
```

### Database
```env
MONGODB_URI=mongodb://localhost:27017/appzeto
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appzeto?retryWrites=true&w=majority
```

### JWT Authentication
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this-in-production
JWT_REFRESH_EXPIRE=30d
```

### CORS & Frontend
```env
FRONTEND_URL=http://localhost:5173
```

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
```

### Cloudinary (File Uploads)
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Email Service
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Appzeto <noreply@appzeto.com>"
```

### Admin Configuration
```env
ADMIN_REGISTRATION_CODE=secure-code-to-create-admins
ADMIN_NOTIFICATION_EMAILS=admin1@example.com,admin2@example.com
```

### Razorpay Payment Gateway
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
```

### OTP Configuration
```env
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5
USE_DEFAULT_OTP=true  # For development only
PASSWORD_RESET_OTP_EXPIRY_MINUTES=10
PASSWORD_RESET_MAX_ATTEMPTS=5
PASSWORD_RESET_TOKEN_EXPIRY_MINUTES=30
```

### Socket.io
```env
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### Google Maps API
```env
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 🚀 API Endpoints

### Health Check
- `GET /health` - API health status

### User Routes
- `POST /api/users/auth/register` - User registration
- `POST /api/users/auth/login` - User login
- `POST /api/users/auth/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/user/wallet` - Get wallet details
- `GET /api/users/bookings` - Get user bookings
- `GET /api/users/cart` - Get cart items
- `POST /api/users/cart` - Add to cart

### Vendor Routes
- `POST /api/vendors/auth/register` - Vendor registration
- `POST /api/vendors/auth/login` - Vendor login
- `GET /api/vendors/profile` - Get vendor profile
- `PUT /api/vendors/profile` - Update vendor profile
- `GET /api/vendors/dashboard` - Vendor dashboard stats
- `GET /api/vendors/services` - Get vendor services
- `POST /api/vendors/services` - Create service
- `PUT /api/vendors/services/:id` - Update service
- `DELETE /api/vendors/services/:id` - Delete service
- `GET /api/vendors/wallet` - Get wallet details
- `GET /api/vendors/bookings` - Get vendor bookings
- `GET /api/vendors/workers` - Get vendor workers
- `POST /api/vendors/workers` - Add worker

### Worker Routes
- `POST /api/workers/auth/register` - Worker registration
- `POST /api/workers/auth/login` - Worker login
- `GET /api/workers/profile` - Get worker profile
- `PUT /api/workers/profile` - Update worker profile
- `GET /api/workers/jobs` - Get assigned jobs

### Admin Routes
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - User management
- `GET /api/admin/vendors` - Vendor management
- `GET /api/admin/categories` - Category management
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/services` - Service management
- `GET /api/admin/home-page` - Home page content management
- `PUT /api/admin/home-page` - Update home page content
- `GET /api/admin/bookings` - Booking management
- `GET /api/admin/payments` - Payment management
- `POST /api/admin/upload` - File upload

### Booking Routes
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payment Routes
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Razorpay webhook

### Notification Routes
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Public Routes (No Auth)
- `GET /api/public/categories` - Get all categories
- `GET /api/public/services` - Get all services
- `GET /api/public/services/:id` - Get service details
- `GET /api/public/home-content` - Get home page content

---

## 🗄️ Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password hash)
- Address details
- Wallet balance
- Booking history
- Cart items

### Vendor Model
- Business information
- Service categories
- Ratings and reviews
- Wallet balance
- Workers list
- Verification status

### Worker Model
- Personal information
- Associated vendor
- Service category
- Assigned jobs
- Availability status

### Admin Model
- Admin credentials
- Role and permissions

### Booking Model
- User reference
- Vendor/Worker reference
- Service details
- Scheduling information
- Status tracking
- Payment details
- Timeline events

### Service Model
- Service name and description
- Category reference
- Pricing information
- Images
- FAQs
- Vendor reference
- Ratings and reviews

### Category Model
- Category name
- Icon/Image
- Description
- Service count

### Cart Model
- User reference
- Service items
- Quantities
- Pricing

### Notification Model
- Recipient reference
- Message content
- Type (booking, payment, etc.)
- Read status
- Timestamp

### HomeContent Model
- Banners
- Featured services
- Category sections
- Promotional content

### Token Model
- User reference
- Refresh tokens
- Expiry tracking

---

## 🔒 Security Features

1. **Authentication**: JWT-based with access and refresh tokens
2. **Password Security**: bcrypt hashing with salt rounds
3. **Rate Limiting**: Prevents API abuse
4. **Helmet**: Security headers for Express
5. **CORS**: Configured for specific frontend origin
6. **Input Validation**: express-validator for request validation
7. **Role-based Access Control**: Middleware for user/vendor/worker/admin roles

---

## 📦 NPM Scripts

### Development
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production start
```

### Database Seeding
```bash
npm run seed:admin                  # Create admin user
npm run seed:database              # Seed entire database
npm run seed:electrician           # Seed electrician services
npm run seed:category-sections     # Seed home category sections
npm run seed:vendors               # Seed vendor data
npm run seed:vendor-bookings       # Seed vendor bookings
npm run seed:vendor-data           # Seed vendors + bookings
```

### Image Management
```bash
npm run upload:category-icons      # Upload category icons to Cloudinary
npm run upload:home-content-images # Upload home page images
npm run update:home-content-images # Update home page images
npm run migrate:category-icons     # Migrate category icons
npm run upload:icons               # Upload icons
npm run upload:home                # Upload home images
npm run upload:services            # Upload service images
```

### Testing
```bash
npm test             # Run tests
```

---

## 🔌 Real-time Features (Socket.io)

The backend implements Socket.io for real-time features:
- Live booking status updates
- Real-time notifications
- Chat/messaging (if implemented)
- Worker location tracking
- Live dashboard updates

---

## 📧 Email Service

Uses Nodemailer for:
- OTP verification
- Password reset
- Booking confirmations
- Notifications
- Admin alerts

---

## 💳 Payment Integration

**Razorpay Integration** for:
- Order creation
- Payment verification
- Webhook handling
- Refund processing
- Payment history

---

## 🌍 Location Services

Google Maps API integration for:
- Address geocoding
- Distance calculation
- Service area validation
- Worker location tracking

---

## 📊 File Storage

**Cloudinary** for:
- Profile images
- Service images
- Category icons
- Home page banners
- Document uploads

---

## 🧪 Testing Requirements

- Unit tests for controllers
- Integration tests for API endpoints
- MongoDB memory server for isolated testing
- Supertest for HTTP assertions

---

## 🚀 Deployment Considerations

### Production Requirements
1. **MongoDB Atlas** or managed MongoDB instance
2. **Cloudinary** account for file storage
3. **Razorpay** production credentials
4. **SMTP** service for emails
5. **SSL/TLS** certificates
6. **Environment variables** properly configured
7. **Rate limiting** adjusted for production traffic
8. **Logging** service (e.g., Winston, LogRocket)
9. **Monitoring** (e.g., PM2, New Relic)

### Vercel Compatibility
The server.js includes Vercel-specific configuration for serverless deployment.

---

## 📝 Development Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Copy environment file**: `cp env.example .env`
4. **Configure environment variables** in `.env`
5. **Start MongoDB** (local or Atlas)
6. **Seed database** (optional): `npm run seed:database`
7. **Start development server**: `npm run dev`
8. **Test API**: Visit `http://localhost:5000/health`

---

## 🔍 Key Features to Implement/Verify

- [ ] User authentication and authorization
- [ ] Vendor onboarding and verification
- [ ] Worker management
- [ ] Service catalog management
- [ ] Booking creation and management
- [ ] Payment processing
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] File upload handling
- [ ] Admin dashboard
- [ ] Wallet system
- [ ] Rating and review system
- [ ] Search and filtering
- [ ] Location-based services
- [ ] Cart functionality
- [ ] OTP verification
- [ ] Password reset flow

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Database backups
- Log rotation
- Security updates
- Dependency updates
- Performance monitoring
- API usage analytics

---

## 🐛 Common Issues & Solutions

1. **MongoDB Connection**: Ensure MONGODB_URI is correct and MongoDB is running
2. **CORS Errors**: Verify FRONTEND_URL matches your frontend
3. **File Upload Issues**: Check Cloudinary credentials
4. **Payment Failures**: Verify Razorpay keys and webhook configuration
5. **Email Not Sending**: Check SMTP credentials and firewall settings

---

## 📚 Additional Resources

- Express.js Documentation
- MongoDB/Mongoose Documentation
- Socket.io Documentation
- Razorpay API Documentation
- Cloudinary API Documentation
- JWT Best Practices

---

**Last Updated**: December 2024
**Version**: 1.0.0
