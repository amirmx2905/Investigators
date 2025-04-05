# Investigators

A web platform connecting researchers in Mexico to collaborate on projects, articles, and events. Designed as a specialized networking tool for the CONACYT community, it helps researchers find collaborators based on expertise, fostering interdisciplinary cooperation.

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
    <a href="https://eslint.org/" style="text-decoration: none;"><img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"></a>
</p>

## Setup Guide
This guide will help you set up the project on either Mac or Windows.

### Prerequisites
- Python 3.9 or higher
- PostgreSQL 13 or higher
- Node.js 16 or higher
- npm 8+
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

#### 5. Configure the enviroment variables
Create a `.env` file in the `Investigators` directory with the following content:
```bash
# Django settings
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Database settings
DB_ENGINE=django.db.backends.postgresql
DB_NAME=investigators
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# FrontEnd settings
VITE_API_URL=http://127.0.0.1:8000/api

# Other settings
TIME_ZONE=UTC
```   

#### - How to get your own django `secret key`?
```bash
# Open Django Shell
python manage.py shell

# Run the following code
from django.core.management.utils import get_random_secret_key
print("\n" + "SECRET_KEY = " + get_random_secret_key() + "\n")
```

#### 6. Make the migrations
```bash
#Make sure to be in the backend Directory
python manage.py makemigrations
```

#### 7. Run the migrations
```bash
python manage.py migrate
```

#### 8. Export test data to your db (make sure to be on the backend directory)
```bash
python manage.py loaddata test_data.json
```

#### 9. If you wish to create an admin user by yourself, paste the following code on your terminal
```bash
#First Open Django Shell
python manage.py shell

#Change "your_username" for your user, and "your_password" for your password.
from investigators.models import Usuario

admin_user = Usuario(
    nombre_usuario="your_username",
    rol="admin"
)
admin_user.set_password("your_password")
admin_user.save()

# To exit Django Shell use the following command
exit()
```

#### 10. Run the development server
```bash
python manage.py runserver
```
Visit [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser to see the backend.

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

#### 3. If the terminal shows that there are vulnerabilities, run the following command. if not, just skip this step
```bash
npm audit fix
```

#### 4. Start the development server
```bash
npm run dev
```
Visit the URL provided in the terminal (e.g., [http://127.0.0.1:5173](http://127.0.0.1:5173)) to see the frontend.

---

## Running Both Frontend and Backend

1. Open two terminal windows or tabs.
2. In the first terminal:

   Activate the virtual environment.
   ```bash
    #For Mac/Linux
    python3 -m venv env
    source env/bin/activate

    #For Windows
    python -m venv env
    env\Scripts\activate
    ```
   
   Navigate to the `backend` directory.
   ```bash
    cd backend
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
- The **backend** at [http://127.0.0.1:8000](http://127.0.0.1:8000)
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