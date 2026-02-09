# Backend – Company & User Management API

RESTful API built with Node.js (H3) and MySQL for managing companies and users.

## Tech Stack

- Node.js (H3 framework)
- MySQL
- Zod for validation
- Axios for external API calls (geocoding)

---

## Setup

### Install dependencies

```bash
pnpm install
```
## Create database
```
CREATE DATABASE company_manager;
USE company_manager;
```
## Run migrations:
```sql
SOURCE db/migration/001_init.sql;
```
## Environment Variables
```Create a .env file:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=company_manager
```
## Start server: 
```
pnpm dev
```
## API runs at:
```
http://localhost:3000
```
## Notes

- Follows RESTful conventions

- Uses relational schema with foreign keys

- Handles validation and error responses properly
