# Company & User Management System

A full-stack web application for managing companies and users with geolocation mapping, user migration, and a modern responsive UI.

Built with a RESTful backend and a React frontend for seamless browser-based management.

---

## 🚀 Tech Stack

### Backend
- Node.js (H3 framework)
- MySQL
- Zod (schema validation)
- Axios (external API requests)

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Leaflet (maps)

**Why this stack?**  
Chosen for speed, scalability, and modern developer experience compared to traditional Express-based setups.

---

## ✨ Features

### 🏢 Company Management
- Create, update, and delete companies  
- Automatically fetch coordinates from address  
- Display company location on map  
- Assign and remove users  

### 👤 User Management
- Create and update users  
- Deactivate users  
- Migrate users between companies  

### 💻 UI
- Fully responsive design  
- Inline editing  
- Mobile-friendly views  

---

## 🗺 Location Mapping

Company addresses are converted into latitude and longitude and displayed using Leaflet for accurate map visualization.

---
## Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- MySQL
- pnpm (npm install -g pnpm)

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Narendran-arch/cultureMonkey.git
cd company-user-management
```
## 🛢 Backend Setup
- Install dependencies
- cd backend
- pnpm install

## Create database
```bash
CREATE DATABASE company_manager;
USE company_manager;
```

## Run migrations:
```
SOURCE backend/db/migration/001_init.sql;
```
## Environment variables
```
Create .env file:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=company_manager
```
## Start server
pnpm dev


## Backend runs at:

http://localhost:3000

## 🌐 Frontend Setup
```
cd frontend
pnpm install
pnpm dev
```

## Frontend runs at:

http://localhost:5173
## API Endpoints

### Companies

| Method | Endpoint | Description |
|-------|---------|------------|
| GET | /companies | List companies |
| POST | /companies | Create company |
| GET | /companies/:id | Get company by ID |
| PUT | /companies/:id | Update company |
| DELETE | /companies/:id | Delete company |
| POST | /companies/:id/users | Assign user to company |

---

### Users

| Method | Endpoint | Description |
|-------|---------|------------|
| GET | /users | List users |
| POST | /users | Create user |
| GET | /users/:id | Get user by ID |
| PUT | /users/:id | Update user |
| PATCH | /users/:id/migrate | Migrate user to another company |

## 🧠 Architecture Highlights

- RESTful API design

- Relational data with foreign keys

- Address geocoding for coordinates

- Clean separation of frontend and backend

- Error handling with proper status codes
