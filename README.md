# Investigators

A web platform connecting researchers in Mexico to collaborate on projects, articles, and events. Designed as a specialized networking tool for the CONACYT community, it helps researchers find collaborators based on expertise, fostering interdisciplinary cooperation.

## Tech Stack

<p align="center">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
</p>

## Setup Guide
This guide will help you set up the project on either Mac or Windows.

### Prerequisites
- Python 3.9 or higher
- PostgreSQL 13 or higher
- Git

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/amirmx2905/Investigators.git
cd Investigators
```

#### 2. Create a Virtual Environment

**Mac/Linux:**
```bash
python3 -m venv env
source env/bin/activate
```

**Windows:**
```bash
python -m venv env
env\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure Database

**Create a PostgreSQL database:**

**Mac/Linux:**
```bash
createdb investigators
```

**Windows:**
Use pgAdmin or run:
```powershell
createdb investigators
```

**Configure environment variables:**

Create a `.env` file in the project root with the following content:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=investigators
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

#### 5. Run Migrations
```bash
python manage.py migrate
```

#### 6. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### 7. Run the Development Server
```bash
python manage.py runserver
```
Visit [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser to see the application.

## Project Structure
```
Investigators/
├── investigators/       # Main app containing models, views, and business logic
│   ├── migrations/      # Database migrations
│   ├── templates/       # HTML templates
│   ├── static/          # Static files (CSS, JS, images)
│   ├── views/           # Views for handling requests
│   └── models.py        # Database models
├── project/             # Project settings and main URL configuration
│   ├── settings.py      # Django settings
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI configuration
├── env/                 # Virtual environment (not tracked by git)
├── manage.py            # Django's command-line utility
├── requirements.txt     # Project dependencies
├── .env                 # Environment variables (not tracked by git)
└── .env.example         # Example environment variables file
```

### Authentication System
This project uses a custom authentication system:
- Users can be administrators, researchers, students, or guests
- Authentication is handled through the `Usuario` model
- User credentials include username and password
- Access is managed through custom middleware and decorators

### Database Schema
The database includes models for:
- Investigators and their specialties
- Research areas and departments
- Students and their academic information
- Projects, articles, and collaborative events
- Authentication and user management

## Common Issues

### PostgreSQL Connection Issues:
**Mac:**
Ensure PostgreSQL service is running with:
```bash
brew services start postgresql
```

**Windows:**
Check if the PostgreSQL service is running in Services.

### Migration Errors:
If you encounter migration errors, try running:
```bash
python manage.py migrate --run-syncdb
```

### Module Not Found Errors:
- Ensure your virtual environment is activated.
- Verify all requirements are installed with:
```bash
pip freeze
```

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.