# Step 1 (Backend)

>1- python -m venv env

>2- source env/bin/activate (env/Scripts/activate)

>3- mkdir backend

>4- cd backend

>5- pip install django djangorestframework django-cors-headers

>6- django-admin startproject backend .

>7- django-admin startapp api

>8- python manage.py makemigrations

>9- python manage.py migrate

>10- python manage.py runserver

# Step 2 (Frontend)

>1- mkdir frontend

>2- npx create-next-app@latest ./

>3- npm run dev

>4- npm i -D daisyui@latest

>5-Add daisyui to app.css

    @plugin "daisyui";
    @import "tailwindcss";

>6- npm i axios

>7- npm add react-hot-toast

>8- npm install lucide-react
