[![Build Backend](https://github.com/Meti27/Hotel-Booking-system/actions/workflows/build.yaml/badge.svg)](https://github.com/Meti27/Hotel-Booking-system/actions/workflows/build.yaml)

Hotel Booking System

This is a full-stack Hotel Booking application built with Spring Boot (Java), SQL Server, and React.
It allows users to browse rooms, check availability by date, make bookings, and view their reservations.
Admins can manage rooms and bookings through a protected dashboard.

Features
User Features

View all hotel rooms

Filter rooms by availability (check-in / check-out)

Book rooms with real date-conflict prevention

View personal bookings

Login system (simple demo authentication)

Admin Features

Add new rooms

Delete rooms (only if not booked)

View all bookings

Admin-only routes

Room and booking management panel

Tech Stack

Frontend: React, React Router, Context API (Auth), Axios
Backend: Spring Boot, Spring Web, Spring Data JPA, SQL Server JDBC
Database: Microsoft SQL Server
Architecture: Controllers, Services, Repositories, DTOs, Entities

How to Run (Backend)

Create a SQL Server login by running this in SSMS:

CREATE LOGIN hotel_app_user WITH PASSWORD = 'YourPassword123!', CHECK_POLICY = OFF;
GO

USE room_booking;
CREATE USER hotel_app_user FOR LOGIN hotel_app_user;
ALTER ROLE db_owner ADD MEMBER hotel_app_user;
GO


Copy application-example.properties → application.properties, and fill in your own DB credentials:

spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=room_booking;encrypt=true;trustServerCertificate=true;
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update


Run the Spring Boot application (from IntelliJ or using mvn spring-boot:run).
Backend runs on: http://localhost:8080

How to Run (Frontend)

Inside the frontend folder:

npm install
npm run dev


Frontend runs on: http://localhost:5173

Demo Login Accounts

Admin

Email: admin@hotel.com
Password: admin123


User

Email: john@doe.com
Password: user123


These are simple demo users stored in the frontend for portfolio purposes.

Future Improvements

Real JWT authentication

Room images and upload support

Multi-language UI

Payment system (Stripe)

Dashboard charts for admins
