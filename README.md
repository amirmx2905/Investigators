# Investigators

A web platform connecting researchers in Mexico to collaborate on projects, articles, and events. Designed as a specialized networking tool for the CONACYT community, it helps researchers find collaborators based on expertise, fostering interdisciplinary cooperation.

## Tech Stack

<p align="center">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
    <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

## Setup Guide
This guide will help you set up the project on either Mac or Windows.

### Prerequisites
- Python 3.9 or higher
- PostgreSQL 13 or higher
- Node.js 16 or higher
- Git

---

## Backend Setup

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/amirmx2905/Investigators.git
cd Investigators
```

#### 2. Create a virtual environment
```bash
#For Mac/Linux
python3 -m venv env
source env/bin/activate

#For Windows
python -m venv env
env\Scripts\activate
```

#### 3. Install dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure the database
Create a PostgreSQL database:
```bash
createdb investigators
```   

Create a `.env` file in the `Investigators` directory with the following content:
```bash
DEBUG=True
yourSECRET_KEY=_secret_key_here

DB_ENGINE=django.db.backends.postgresql
DB_NAME=investigators
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

ALLOWED_HOSTS=localhost,127.0.0.1
TIME_ZONE=UTC
```   

#### 5. Run migrations
```bash
python manage.py migrate
```

#### 6. Create a superuser (optional)
```bash
python manage.py createsuperuser
```

#### 7. Run the development server
```bash
python manage.py runserver
```
Visit [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser to see the backend (optional).

---

## Frontend Setup

### Installation Steps

#### 1. Navigate to the `frontend` directory
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start the development server
```bash
npm run dev
```
Visit the URL provided in the terminal (e.g., [http://127.0.0.1:5173](http://127.0.0.1:5173)) to see the frontend.

---

## Running Both Frontend and Backend

1. Open two terminal windows or tabs.
2. In the first terminal:
   
   Navigate to the `backend` directory.
   ```bash
    cd backend
    ```

   Activate the virtual environment.
   ```bash
    #For Mac/Linux
    python3 -m venv env
    source env/bin/activate

    #For Windows
    python -m venv env
    env\Scripts\activate
    ```

   Run the Django server:
   ```bash
    python manage.py runserver
    ```

3. In the second terminal:
   Navigate to the `frontend` directory.
   ```bash
    cd frontend
    ```

   - Start the Vite development server:
   ```bash
    npm run dev
    ```

Now you can access:
- The **backend** at [http://127.0.0.1:8000](http://127.0.0.1:8000) (optional)
- The **frontend** at [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## Common Issues

### PostgreSQL Connection Issues:

```bash
#For Mac
brew services start postgresql

#For Windows
Check if the PostgreSQL service is running in Services.
```

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

---

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## Authors
- [@amirmx2905](https://github.com/amirmx2905)
- [@WatchfulInk](https://github.com/WatchfulInk)