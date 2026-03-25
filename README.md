# 📝 Notes App -- Full‑Stack Demo

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring
Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple)
![Docker](https://img.shields.io/badge/Docker-MySQL-blue)
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

              +-------------------+
              |   React + Vite    |
              |   Frontend SPA    |
              +---------+---------+
                        |
                        | HTTP / REST
                        |
              +---------v---------+
              |   Spring Boot API |
              |   Authentication  |
              |   Business Logic  |
              +---------+---------+
                        |
                        | JPA / Hibernate
                        |
              +---------v---------+
              |      MySQL 8      |
              |   (Dockerized)    |
              +-------------------+

---

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

---

# 🗄 Database Configuration

The application uses **MySQL 8 running inside Docker**.

Database details:

- Database: `db_note`
- User: `root`
- Password: `root`
- Port: `3306`

Hibernate automatically generates tables when the application starts.

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

# ✨ Features

## Notes

- Create notes
- Update notes
- Delete notes
- Archive notes
- Unarchive notes
- Separate views for archived and active notes

## Categories

- Assign categories to notes
- Display categories as tags
- Filter notes by category

---

# 🔗 API Endpoints

### Authentication

    POST /api/auth/login

### Notes

    GET    /api/notes
    POST   /api/notes
    PUT    /api/notes/{id}
    DELETE /api/notes/{id}

### Categories

    GET  /api/categories
    POST /api/categories

---

# 👨‍💻 Author

**Tomás Gabriel Cardozo**

- Systems Engineering Student
- Full‑Stack Developer
