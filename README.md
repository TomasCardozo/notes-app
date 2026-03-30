# 📝 Notes App -- Full‑Stack Demo

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-black)
![REST API](https://img.shields.io/badge/API-REST-green)
![OpenAPI](https://img.shields.io/badge/OpenAPI-Swagger-green)
![Architecture](https://img.shields.io/badge/Architecture-Layered-blue)
![Monorepo](https://img.shields.io/badge/Structure-Monorepo-lightgrey)
![License](https://img.shields.io/badge/License-Demo-lightgrey)

A **full‑stack demo application** built with **Spring Boot, React, and
MySQL**.

This project demonstrates a simple **notes management system** with
authentication, categories, and archive functionality.

The repository is structured as a **monorepo** containing backend,
frontend, and infrastructure configuration.

---

# 📚 Table of Contents

- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Database Configuration](#-database-configuration)
- [Running the Application](#-running-the-application)
- [Windows Users](#-windows-users)
- [Linux Users](#-linux-users)
- [Authentication](#-authentication--security)
- [Frontend Authentication Flow](#-frontend-authentication-flow)
- [API Documentation (Swagger)](#-api-documentation-swagger)
- [Features](#-features)
- [API Endpoints](#-api-endpoints)
- [Author](#-author)

---

# 📦 Project Structure

    backend/             # Spring Boot REST API
    frontend/            # React + Vite frontend
    docker-compose.yml   # MySQL database container
    run.sh               # Script to start the full application
    README.md

---

# 🏗 Architecture

              +---------------------------+
              |      React + Vite SPA     |
              |---------------------------|
              | UI Components             |
              | Routing                   |
              | API Client (Axios)        |
              | JWT Storage (localStorage)|
              +-------------+-------------+
                            |
                            | HTTP / REST
                            |
              +-------------v-------------+
              |      Spring Boot API      |
              |---------------------------|
              | Controller Layer          |
              | Service Layer             |
              | Repository Layer          |
              | Security Layer            |
              +-------------+-------------+
                            |
                            | JPA / Hibernate
                            |
              +-------------v-------------+
              |        MySQL 8            |
              |---------------------------|
              | Docker containerized DB   |
              +---------------------------+

---

## Backend Architecture

The backend follows standard Spring Boot layering:

### Controller

Handles HTTP requests and responses.
Maps endpoints to application use cases.

### Service

Contains business logic and orchestrates operations.
Ensures separation between HTTP concerns and domain logic.

### Repository

Responsible for data access using Spring Data JPA.
Abstracts persistence details from business logic.

### Security

Implements stateless authentication using JWT tokens.
Each request is validated through a security filter before reaching protected endpoints.

---

## Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend validates credentials
3. A JWT token is generated and returned
4. Frontend stores token in localStorage
5. Axios automatically includes the token in Authorization headers
6. Spring Security validates the token on each request

---

## Infrastructure

### Database

MySQL runs inside Docker, ensuring consistent local environments.

### Monorepo structure

Frontend, backend, and infrastructure configuration coexist in a single repository to simplify development and setup.

### run.sh script

The project provides a single command to start:

- MySQL container
- Spring Boot backend
- React frontend

This reduces onboarding complexity and improves developer experience.

# ⚙️ Technologies

## Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- Maven

## Frontend

- JavaScript
- React
- Vite
- React Router
- Axios
- Bootstrap 5

## Database

- MySQL 8 (running inside Docker)

## Tools

- Docker
- Docker Compose
- Git

## Documentation

- Swagger / OpenAPI

---

# 🗄 Database Configuration

The application uses **MySQL 8 running inside Docker**.

Database details:

- Database: `db_note`
- User: `root`
- Password: `root`
- Port: `3306`

Hibernate automatically generates tables when the application starts (development only).

    spring.jpa.hibernate.ddl-auto=update

---

# 🚀 Running the Application

The project includes a script that starts the entire application:

- MySQL database (Docker)
- Spring Boot backend
- React frontend

Run from the **root of the repository**:

```bash
./run.sh
```

After startup:

Backend API

    http://localhost:8080

Frontend UI

    http://localhost:5173

Swagger UI

    http://localhost:8080/swagger-ui/index.html

OpenAPI JSON

    http://localhost:8080/v3/api-docs

---

# 🪟 Windows Users

If you are running the project on **Windows**, you must install **Docker
Desktop** before executing the script.

Download Docker Desktop:

https://www.docker.com/products/docker-desktop/

After installing Docker Desktop:

1.  Open **Git Bash**
2.  Run:

```bash
./run.sh
```

---

# 🐧 Linux Users

The script supports **Ubuntu and Debian**.

If Docker is not installed, the script will **automatically install
Docker and Docker Compose**.

Run:

```bash
chmod +x run.sh
./run.sh
```

---

# 🔐 Authentication & Security

The backend API is protected using **JWT authentication**.

A default test user is automatically created when the backend starts.

Credentials:

    Username: admin
    Password: admin123

---

# 🔄 Frontend Authentication Flow

- If the user is **not authenticated**, the app redirects to `/login`
- After login:
  - the JWT token is stored in `localStorage`
  - Axios attaches the token to all API requests
- If the backend returns **401 Unauthorized**:
  - the token is removed
  - the user is redirected to the login page

---

# 📚 API Documentation (Swagger)

The backend exposes an OpenAPI specification using Swagger, allowing you to explore and test all available endpoints interactively.

### Access

Once the backend is running, the documentation is available at:

- Swagger UI  
  http://localhost:8080/swagger-ui/index.html

- OpenAPI specification (JSON)  
  http://localhost:8080/v3/api-docs

### Features

Swagger allows you to:

- Explore all available REST endpoints
- View request and response schemas
- Execute requests directly from the browser
- Validate request payloads
- Understand required parameters and authentication requirements

Speeds up development, testing, and integration.

> If the backend runs on a different port, adjust the URL accordingly.

---

# ✨ Features

## Notes Management

Provides a simple and efficient workflow to manage notes.

Capabilities:

- Create and edit notes
- Delete notes when no longer needed
- Archive notes to keep the workspace organized
- Restore archived notes at any time
- Separate views for active and archived notes

Supports a clean productivity workflow while preserving historical information.

## Categorization System

Organize notes using flexible categories.

Capabilities:

- Assign multiple categories to a single note
- Remove categories dynamically
- Visualize categories as tags
- Filter notes by category
- Improve discoverability of information

Allows users to structure information based on context, priority, or topic.

---

# 🔗 API Endpoints

All endpoints require authentication via JWT except the login endpoint.

## Authentication

Handles user authentication and JWT token generation.

| Method | Endpoint          | Description                            |
| ------ | ----------------- | -------------------------------------- |
| POST   | `/api/auth/login` | Authenticate user and return JWT token |

## Notes

Manages note resources.

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/api/notes`      | Retrieve all notes   |
| GET    | `/api/notes/{id}` | Retrieve note by id  |
| POST   | `/api/notes`      | Create new note      |
| PUT    | `/api/notes/{id}` | Update existing note |
| DELETE | `/api/notes/{id}` | Delete note          |

## Note Lifecycle

Endpoints related to note state management.

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| PATCH  | `/api/notes/{id}/archive`   | Archive a note   |
| PATCH  | `/api/notes/{id}/unarchive` | Unarchive a note |

## Note Categories

Manages relationships between notes and categories.

| Method | Endpoint                                  | Description                          |
| ------ | ----------------------------------------- | ------------------------------------ |
| POST   | `/api/notes/{id}/categories`              | Assign multiple categories to a note |
| POST   | `/api/notes/{id}/categories/{categoryId}` | Assign single category to note       |
| DELETE | `/api/notes/{id}/categories/{categoryId}` | Remove category from note            |

## Categories

Manages category resources.

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | `/api/categories`      | Retrieve all categories |
| POST   | `/api/categories`      | Create category         |
| DELETE | `/api/categories/{id}` | Delete category         |

---

# 👨‍💻 Author

**Tomás Gabriel Cardozo**

- Systems Engineering Student
- Full‑Stack Developer
