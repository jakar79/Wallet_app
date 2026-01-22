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

>10- python manage.py runserver 8008


# Step 2 (Frontend)

>1- mkdir frontend & cd frontend

>2- npm install or (npx create-next-app@latest ./)

>3- npm i -D daisyui@latest

>4-Add daisyui to app.css

    @plugin "daisyui";
    @import "tailwindcss";

>5- Create .env file and add (NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/)

>6- npm i axios

>7- npm add react-hot-toast

>8- npm install lucide-react

>9- npm run dev

# Resources:

https://nextjs.org/

https://daisyui.com/

https://react-hot-toast.com/

https://lucide.dev/guide/packages/lucide-react




