# Eventify

## Description
Eventify is a modern event management platform that helps users create, manage, and discover events. Built with cutting-edge technologies, it provides a seamless experience for both event organizers and attendees.

## Features
- User authentication and authorization
- Event creation and management
- Event discovery and search
- Ticket booking and management
- Real-time notifications
- Interactive event calendar
- Social sharing integration

## Technologies Used
- Backend: Spring Boot, Java
- Build Tool: Maven
- Database: PostgreSQL
- Authentication: Spring Security, JWT
- API Documentation: Swagger/OpenAPI
- Cloud Storage: AWS S3
- Payment Processing: Stripe

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- PostgreSQL 13+
- IDE (Spring Tool Suite or IntelliJ IDEA recommended)

### Installation
1. Clone the repository
2. Navigate to the project directory
   ```bash
   cd Eventify
   ```
3. Build the project
   ```bash
   mvn clean install
   ```
4. Configure application properties
   - Rename `src/main/resources/application.properties.example` to `application.properties`
   - Update database credentials and other configurations

5. Run the application
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### API Documentation
Once the application is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Docs: `http://localhost:8080/v3/api-docs`
