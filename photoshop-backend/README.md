# PhotoShop Backend API

A production-ready Spring Boot REST API for a photo shop website with service booking, equipment rental, gallery, and reviews.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Spring Boot 3.2.5 |
| Language | Java 17 |
| Database | MySQL 8.0 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT |
| Image Upload | Cloudinary |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build Tool | Maven |
| Deployment | Docker / Docker Compose |

---

## Project Structure

```
src/main/java/com/photoshop/
├── config/           # Security, OpenAPI, optional admin bootstrap
├── controller/       # REST controllers
├── dto/
│   ├── request/      # Input DTOs with validation
│   └── response/     # Output DTOs
├── entity/           # JPA entities
├── exception/        # Custom exceptions + global handler
├── repository/       # Spring Data JPA repositories
├── security/         # JWT utils + filters
└── service/impl/     # Business logic
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login → returns JWT tokens |
| POST | `/api/auth/refresh-token` | Public | Refresh access token |

### Services (Photo Shoots)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/services` | Public | List all services (paginated) |
| GET | `/api/services/{id}` | Public | Get service details |
| GET | `/api/services/type/{type}` | Public | Filter by type |
| GET | `/api/services/search?keyword=` | Public | Search services |
| POST | `/api/services` | Admin | Create service |
| PUT | `/api/services/{id}` | Admin | Update service |
| DELETE | `/api/services/{id}` | Admin | Soft-delete service |

### Equipment Rental
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/equipment` | Public | List equipment (paginated) |
| GET | `/api/equipment/{id}` | Public | Get equipment details |
| GET | `/api/equipment/available` | Public | List available items |
| GET | `/api/equipment/category/{cat}` | Public | Filter by category |
| POST | `/api/equipment` | Admin | Add equipment |
| PUT | `/api/equipment/{id}` | Admin | Update equipment |
| DELETE | `/api/equipment/{id}` | Admin | Soft-delete |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Auth | Create booking |
| GET | `/api/bookings/my` | Auth | My bookings |
| GET | `/api/bookings/{id}` | Auth | Get booking |
| PATCH | `/api/bookings/{id}/cancel` | Auth | Cancel booking |
| GET | `/api/bookings` | Admin | All bookings |
| PATCH | `/api/bookings/{id}/status` | Admin | Update status |
| PATCH | `/api/bookings/{id}/payment` | Admin | Update payment |

### Rental Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/rental-orders` | Auth | Create order |
| GET | `/api/rental-orders/my` | Auth | My orders |
| GET | `/api/rental-orders/{id}` | Auth | Get order |
| GET | `/api/rental-orders` | Admin | All orders |
| PATCH | `/api/rental-orders/{id}/status` | Admin | Update status |

### Reviews
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/reviews` | Auth | Submit review |
| GET | `/api/reviews/service/{id}` | Public | Service reviews |
| GET | `/api/reviews/equipment/{id}` | Public | Equipment reviews |
| GET | `/api/reviews/pending` | Admin | Pending reviews |
| PATCH | `/api/reviews/{id}/approve` | Admin | Approve review |
| PATCH | `/api/reviews/{id}/reply` | Admin | Reply to review |
| DELETE | `/api/reviews/{id}` | Admin | Delete review |

### Gallery
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/gallery` | Public | All gallery items |
| GET | `/api/gallery/featured` | Public | Featured items |
| GET | `/api/gallery/category/{cat}` | Public | By category |
| POST | `/api/gallery` | Admin | Add item |
| PUT | `/api/gallery/{id}` | Admin | Update item |
| DELETE | `/api/gallery/{id}` | Admin | Delete item |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | All users |
| PATCH | `/api/admin/users/{id}/toggle-status` | Admin | Enable/disable user |
| PATCH | `/api/admin/users/{id}/make-admin` | Admin | Grant admin role |

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.9+
- MySQL 8.0+ (or Docker)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd photoshop-backend

# 2. Copy and edit env file
cp .env.example .env
# Edit .env with your Cloudinary credentials

# 3. Start everything
docker-compose up -d

# 4. Check logs
docker-compose logs -f backend
```

### Option 2: Local Development

```bash
# 1. Create MySQL database
mysql -u root -p -e "CREATE DATABASE photoshop_db;"

# 2. Update src/main/resources/application.properties
#    Set your DB username/password

# 3. Run the application
mvn spring-boot:run

# Or build and run jar
mvn clean package -DskipTests
java -jar target/photoshop-backend-1.0.0.jar
```

### Users and admins (important)

- **Nothing is auto-seeded** on startup unless you deliberately enable **`app.bootstrap-admin`** (see [deploy/README-DEPLOY.md](deploy/README-DEPLOY.md)).
- **Login** is always **email + password**. Public registration creates **`ROLE_USER`** only; **`ROLE_ADMIN`** is required for admin APIs and `/admin` in the frontend.
- **Sample values** you may use with bootstrap (not created automatically):

| Role | Example email | Example password (set yourself) |
|------|---------------|----------------------------------|
| Admin | admin@photoshop.com | Strong password via env `APP_BOOTSTRAP_ADMIN_PASSWORD` |

For production EC2/RDS, follow **“How credentials work”** and **“Getting the first admin”** in [deploy/README-DEPLOY.md](deploy/README-DEPLOY.md).

---

## API Documentation

Once running (default port **8090**, context **`/api`**), visit:
- **Swagger UI**: http://localhost:8090/api/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:8090/api/v3/api-docs

---

## Deployment

### Railway (Recommended - Free Tier)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MySQL plugin
4. Set environment variables:
   ```
   DATABASE_URL=<from Railway MySQL plugin>
   DB_USERNAME=<mysql user>
   DB_PASSWORD=<mysql password>
   JWT_SECRET=<random 64-char string>
   CLOUDINARY_CLOUD_NAME=<your value>
   CLOUDINARY_API_KEY=<your value>
   CLOUDINARY_API_SECRET=<your value>
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   SPRING_PROFILES_ACTIVE=prod
   ```
5. Deploy — Railway auto-detects the Dockerfile

### Render

1. Create a new **Web Service** → connect your GitHub repo
2. Build command: `mvn clean package -DskipTests`
3. Start command: `java -jar target/photoshop-backend-1.0.0.jar`
4. Add the same environment variables as above
5. Create a **MySQL** database service and link it

---

## Service Types
`PORTRAIT` | `WEDDING` | `CORPORATE` | `PRODUCT` | `EVENT` | `FAMILY` | `FASHION` | `REAL_ESTATE`

## Equipment Categories
`CAMERA` | `LENS` | `LIGHTING` | `TRIPOD` | `DRONE` | `BACKDROP` | `STUDIO_KIT` | `ACCESSORIES`

## Gallery Categories
`PORTRAIT` | `WEDDING` | `CORPORATE` | `PRODUCT` | `EVENT` | `FAMILY` | `FASHION` | `REAL_ESTATE`
