# Investigators

A web platform connecting researchers in Mexico to collaborate on projects, articles, and events. Designed as a specialized networking tool for the CIATEQ community, it helps researchers find collaborators based on expertise, fostering interdisciplinary cooperation.

<br>

## Tech Stack

<p align="center">
    <a href="https://www.python.org/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>&nbsp;
    <a href="https://www.djangoproject.com/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"></a>&nbsp;
    <a href="https://www.postgresql.org/" style="text-decoration: none;"><img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>&nbsp;
    <a href="https://www.django-rest-framework.org/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Django_REST-FF1709?style=for-the-badge&logo=django&logoColor=white" alt="Django REST Framework"></a>&nbsp;
    <a href="https://jwt.io/" style="text-decoration: none;"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"></a>&nbsp;
    <a href="https://reactjs.org/" style="text-decoration: none;"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>&nbsp; 
    <a href="https://vitejs.dev/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>&nbsp;
    <a href="https://tailwindcss.com/" style="text-decoration: none;"><img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"></a>&nbsp;
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" style="text-decoration: none;"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>&nbsp;
    <a href="https://reactrouter.com/" style="text-decoration: none;"><img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router"></a>&nbsp;
    <a href="https://axios-http.com/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"></a>&nbsp;
    <a href="https://eslint.org/" style="text-decoration: none;"><img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"></a>&nbsp;
    <a href="https://www.docker.com/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>&nbsp;
    <a href="https://www.nginx.com/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"></a>&nbsp;
</p>

<br>

## Setup Guide
This guide will help you set up the project on either Mac or Windows.
<br>

### Prerequisites

- Docker and Docker Compose
- Git

<br>

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/amirmx2905/Investigators.git
cd Investigators
```
<br>

### 2. Create Environment File

Create a `.env` file in the `Investigators` directory with the following content:

```bash
# Django settings
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:80,http://localhost

# Database settings
DB_ENGINE=django.db.backends.postgresql
DB_NAME=investigators
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=5432

# Frontend settings
VITE_API_URL=http://localhost/api

TIME_ZONE=UTC
```

### `Important`

```bash
docker run --rm python:3.9-slim python -c "import random; import string; print('SECRET_KEY=' + ''.join(random.SystemRandom().choice([c for c in string.ascii_letters + string.digits + string.punctuation if c != '$']) for _ in range(50)))"
```

`Note`: In the .env file you should only change the DB_PASSWORD field (for database security) and the SECRET_KEY field (for Django security). The other variables are configured to work with the Docker setup and should remain as provided.

<br>

### 3. Start the Docker Containers

The first time you start the Docker containers you should use the following command:
```bash
docker-compose up --build
```
This command will:

- Build all necessary Docker images (the --build flag ensures everything is built from scratch)
- Create containers for PostgreSQL, Django backend, React frontend, and Nginx
- Set up networking between containers
- Load initial test data into the database
- Start all services

<br>

### 4. Access the Application

Once all containers are running, you can access:
- Frontend: http://localhost/
- API: http://localhost/api/
- API Documentation: http://localhost/api/docs/

<br>

### 5. Default Admin User

The applicacion comes with a pre-configured admin user to access the frontend:
- Username: admin
- Password: admin

<br>

### 6. Stopping the Application

To stop all containers, use the following command:
```bash
docker-compose down
```

<br>

### 7. For Subsequent Runs

After the initial build, you can use the following command:
```bash
docker-compose up 
#or ctrl+c
```

<br>

### 8. Rebuilding after Code Changes

If you make changes to the code and need to rebuild:
```bash
docker-compose up --build
```

<br>

## Project Structure

```bash
Investigators/
├── backend/           # Django backend
│   ├── investigators/ # Main app
│   ├── project/       # Project settings
│   ├── manage.py      # Django management script
│   └── requirements.txt
├── frontend/          # React frontend
│   ├── src/           # Source code
│   ├── package.json   # Node dependencies
│   └── vite.config.js # Vite configuration
├── nginx/             # Nginx configuration for production
│   ├── conf/          # Config files
│   └── Dockerfile     # Nginx Docker image
├── docker-compose.yml # Docker services configuration
└── .env               # Environment variables
```

<br>

## Working with the Application

You can access the PostgreSQL database using:

```bash
# Connect to the PostgreSQL container
docker exec -it investigators-db-1 bash

# Connect to the database
psql -U postgres -d investigators

# Within psql, you can run SQL queries
# For example, list all tables:
\dt
```

Or using a database tool like DBeaver, connect with:

```bash
Host: localhost
Port: 5433 (mapped port in docker-compose)
Database: investigators
User: postgres
Password: your_password (or whatever you set in .env)
```

<br>

## Troubleshooting

### Port Conflicts

If you see errors about ports already in use:

```bash
# Stop any current PostgreSQL service
sudo service postgresql stop  # Linux
brew services stop postgresql # Mac
```

Or change the external port in `docker-compose.yml`

```bash
ports:
  - "5433:5432"  # Change 5433 to any available port
```

<br>

### Container Fails to Start:

Check the logs for specific errors:

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

<br>

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

<br>

## Authors

- [@amirmx2905](https://github.com/amirmx2905)
- [@WatchfulInk](https://github.com/WatchfulInk)
