# FDTest

## 📋 Prerequisites

Before installing, ensure you have the following installed on your system:

- **PHP**: Version 8.2 or higher
- **Composer**: Latest version
- **Node.js**: Version 18 or higher
- **NPM/Yarn**: Latest version
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

# (Optional) Seed the database with sample data
php artisan db:seed
```

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
