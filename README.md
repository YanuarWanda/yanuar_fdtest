# Yanuar FDTest

## 🛠️ Built With Laravel React Starter Kit

This project is based on the Laravel React Starter Kit, which provides a robust foundation for modern full-stack web applications. Each technology was carefully chosen for specific advantages:

- **Laravel 12**: Modern PHP framework with robust backend features
- **Pest PHP**: Modern testing framework for comprehensive test coverage
- **React 19**: Component-based frontend with TypeScript support
- **Inertia.js**: Seamless SPA experience without building a separate API
- **TypeScript**: Static typing for JavaScript
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Radix UI**: Headless, accessible React components
    - _Why chosen_: Provides accessible components without opinionated styling
- **Headless UI**: Unstyled, accessible UI components
    - _Why chosen_: Complements Tailwind CSS perfectly with accessibility features

## 📋 Prerequisites

Before installing, ensure you have the following installed on your system:

- **PHP**: Version 8.2 or higher
- **Composer**: Version 2.6 or higher
- **Node.js**: Version 18 or higher
- **NPM**: Version 9.0 or higher (or **Yarn**: Version 1.22 or higher)
- **Database**: PostgreSQL

### PHP Extensions Required

- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML
- GD or Imagick (for image processing)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YanuarWanda/yanuar_fdtest.git
cd yanuar_fdtest
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Environment Variables

Edit the `.env` file and configure the following:

```env
# Application
APP_NAME="FDTest"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=book_management
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail Configuration (for email verification)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@bookmanagement.com"
MAIL_FROM_NAME="${APP_NAME}"

# File Storage
FILESYSTEM_DISK=public
```

### 6. Database Setup

```bash
# Run database migrations
php artisan migrate

# Seed the database with sample data (10 users + 100+ books)
php artisan db:seed
```

#### 🔑 Test Credentials

After running the seeder, you can log in with these credentials:

- **Email**: `admin@bookmanagement.com`
- **Password**: `password`

The seeder creates:

- **10 users** (1 with known credentials + 9 random users)
- **100+ unique books** distributed among all users
- **Sample data** for testing search, filtering, and pagination features

### 7. Storage Setup

```bash
# Create symbolic link for public storage
php artisan storage:link
```

### 8. Build Frontend Assets

```bash
# For development
npm run dev

# For production
npm run build
```

## 🚀 Running the Application

### Development Mode

```bash
# Terminal 1 - Start Laravel development server
php artisan serve

# Terminal 2 - Start Vite development server
npm run dev
```

The application will be available at: `http://localhost:8000`

### Production Mode

```bash
# Build production assets
npm run build

# Serve with a web server (Apache/Nginx) or use artisan serve
php artisan serve --host=0.0.0.0 --port=8000
```
